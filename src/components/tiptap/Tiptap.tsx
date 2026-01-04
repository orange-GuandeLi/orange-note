import { createTiptapEditor } from "solid-tiptap";
import { createEffect, createSignal, on, onCleanup } from "solid-js";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import { Markdown } from "@tiptap/markdown";
import { ListKit } from "@tiptap/extension-list";
import { UndoRedo } from "@tiptap/extensions/undo-redo";
import { OrangeTaskItem } from "./extansions/OrangeTaskItem/OrangeTaskItem";
import { OrangeCodeBlock } from "./extansions/OrangeCodeBlock/OrangeCodeBlock";
import Typography from "@tiptap/extension-typography";
import Code from "@tiptap/extension-code";
import Heading from "@tiptap/extension-heading";
import { Placeholder, Dropcursor } from "@tiptap/extensions";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import BlockQuote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Highlight from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

import "./tiptap.css";
import { saveImage } from "../../functions";
import toast from "solid-toast";
import { Icon } from "../Icon";
import {
    BoldIcon,
    CheckIcon,
    CodeXml,
    ItalicIcon,
    LinkIcon,
    PaintBucket,
    Redo2Icon,
    Strikethrough,
    SuperscriptIcon,
    UnderlineIcon,
    Undo2Icon,
    X,
} from "lucide-solid";
import { createStore } from "solid-js/store";
import { ToolButton } from "./components/ToolButton";
import { ToolDivider } from "./components/ToolDivider";

type Props = {
    content: string;
    onSave: (content: string) => void;
    onFileDirty: (isDirty: boolean) => void;
    active: boolean;
    basePath: string;
};

export function Tiptap(props: Props) {
    let rafId: number | undefined;
    let editorRef: HTMLDivElement | undefined;
    let dirtyTimeoutId: number | undefined;
    let originalContent = props.content;
    let focused = false;

    const [tempLink, setTempLink] = createSignal("");

    const [editState, setEditState] = createStore<{
        canUndo: boolean;
        canRedo: boolean;
        isBold: boolean;
        canSetBold: boolean;
        isItalic: boolean;
        canSetItalic: boolean;
        isStrike: boolean;
        canSetStrike: boolean;
        isCode: boolean;
        canSetCode: boolean;
        isUnderline: boolean;
        canSetUnderline: boolean;
        isHighlight: boolean;
        canSetHighlight: boolean;
        isLink: boolean;
        canSetLink: (link: string) => boolean;
        isSuperscript: boolean;
        canSetSuperscript: boolean;
    }>({
        canUndo: false,
        canRedo: false,
        isBold: false,
        canSetBold: false,
        isItalic: false,
        canSetItalic: false,
        isStrike: false,
        canSetStrike: false,
        isCode: false,
        canSetCode: false,
        isUnderline: false,
        canSetUnderline: false,
        isHighlight: false,
        canSetHighlight: false,
        isLink: false,
        canSetLink: () => false,
        isSuperscript: false,
        canSetSuperscript: false,
    });

    const editor = createTiptapEditor(() => ({
        element: editorRef!,
        content: props.content ? props.content : undefined,
        contentType: "markdown",
        extensions: [
            Document,
            Paragraph,
            Text,
            Typography,
            Markdown,
            ListKit.configure({
                taskItem: false,
            }),
            UndoRedo.configure({
                depth: 100,
            }),

            Code.configure({
                HTMLAttributes: {
                    class: "bg-base-200 px-1 rounded text-xs",
                },
            }),
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6],
                HTMLAttributes: {
                    class: "font-bold my-2",
                },
            }),
            Placeholder.configure({
                placeholder: "Start writing...",
            }),
            HorizontalRule.configure({
                HTMLAttributes: {
                    class: "divider border-none",
                },
            }),
            Image.configure({
                resize: {
                    enabled: true,
                    directions: ["top", "bottom", "left", "right"], // can be any direction or diagonal combination
                    minWidth: 50,
                    minHeight: 50,
                    alwaysPreserveAspectRatio: true,
                },
            }),
            Dropcursor,
            BlockQuote,
            Bold,
            Highlight,
            Italic,
            Link.configure({
                HTMLAttributes: {
                    class: "link link-primary",
                },
            }),
            Strike,
            Subscript,
            Superscript,
            TextStyleKit,
            Underline,

            OrangeTaskItem,
            OrangeCodeBlock,
        ],
        editorProps: {
            attributes: {
                class: "size-full focus:outline-none text-sm",
            },
            // 拦截粘贴行为
            handlePaste(view, event) {
                const items = event.clipboardData?.items;
                if (!items) {
                    return false;
                }
                for (const item of items) {
                    if (item.type.indexOf("image") !== -1) {
                        // 1. 发现是图片，拦截默认粘贴行为
                        event.preventDefault();

                        const file = item.getAsFile();
                        if (file) {
                            // 2. 执行你的存储逻辑（例如上传到服务器）
                            try {
                                saveImage(file, props.basePath).then(
                                    (imageUrl) => {
                                        view.dispatch(
                                            view.state.tr.replaceSelectionWith(
                                                view.state.schema.nodes.image.create(
                                                    { src: imageUrl },
                                                ),
                                            ),
                                        );
                                    },
                                );
                            } catch (e) {
                                console.error(e);
                                toast.error(
                                    `Failed to save image ${file.name}`,
                                );
                            }
                        }
                        return true; // 表示已处理
                    }
                }
                return false; // 非图片，交给 Tiptap 默认处理
            },
        },
        onMount: ({ editor }) => {
            originalContent = editor.getMarkdown();
            editorRef?.addEventListener("keydown", handleKeyDown);
        },
        onDestroy: () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            if (dirtyTimeoutId) {
                clearTimeout(dirtyTimeoutId);
            }
            editorRef?.removeEventListener("keydown", handleKeyDown);
        },
        onUpdate: ({ editor }) => {
            if (dirtyTimeoutId) {
                clearTimeout(dirtyTimeoutId);
            }
            dirtyTimeoutId = setTimeout(() => {
                const currentContent = editor.getMarkdown();
                props.onFileDirty(currentContent !== props.content);
            }, 200);
        },
        onFocus: () => {
            focused = true;
        },
        onTransaction: ({ editor }) => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }

            rafId = requestAnimationFrame(() => {
                setEditState({
                    canUndo: editor.can().undo(),
                    canRedo: editor.can().redo(),
                    isBold: editor.isActive("bold"),
                    canSetBold: editor.can().setBold(),
                    isItalic: editor.isActive("italic"),
                    canSetItalic: editor.can().setItalic(),
                    isStrike: editor.isActive("strike"),
                    canSetStrike: editor.can().setStrike(),
                    isCode: editor.isActive("code"),
                    canSetCode: editor.can().setCode(),
                    isUnderline: editor.isActive("underline"),
                    canSetUnderline: editor.can().setUnderline(),
                    isHighlight: editor.isActive("highlight"),
                    canSetHighlight: editor.can().setHighlight(),
                    isLink: editor.isActive("link"),
                    canSetLink: (link) => editor.can().setLink({ href: link }),
                    isSuperscript: editor.isActive("superscript"),
                    canSetSuperscript: editor.can().setSuperscript(),
                });
                setTempLink(editor.getAttributes("link").href || "");
            });
        },
    }));

    createEffect(
        on(
            () => props.active,
            (active) => {
                if (active && focused) {
                    setTimeout(() => {
                        editor()?.chain().focus();
                    }, 0);
                }
            },
        ),
    );

    const handleKeyDown = async (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "s") {
            e.preventDefault();
            // 保存内容
            originalContent = editor()?.getMarkdown() || "";
            props.onSave(originalContent);
        }
    };

    onCleanup(() => {
        editor()?.destroy();
    });

    const undo = () => editor()?.chain().focus().undo().run();
    const redo = () => editor()?.chain().focus().redo().run();
    const toggleBold = () => editor()?.chain().focus().toggleBold().run();
    const toggleItalic = () => editor()?.chain().focus().toggleItalic().run();
    const toggleStrike = () => editor()?.chain().focus().toggleStrike().run();
    const toggleCode = () => editor()?.chain().focus().toggleCode().run();
    const toggleUnderline = () =>
        editor()?.chain().focus().toggleUnderline().run();
    const toggleHighlight = () =>
        editor()?.chain().focus().toggleHighlight().run();
    const setLink = (link: string) =>
        editor()?.chain().focus().setLink({ href: link }).run();
    const unSetLink = () => editor()?.chain().focus().unsetLink().run();
    const toggleSuperscript = () =>
        editor()?.chain().focus().toggleSuperscript().run();

    return (
        <div
            class="size-full px-6 relative"
            classList={{
                block: props.active,
                hidden: !props.active,
            }}
        >
            <div class="pt-2 rounded pb-96 size-full overflow-auto">
                <article id="editor" ref={editorRef}></article>
            </div>
            <div class="px-2 py-0.5 absolute bottom-2 left-1/2 -translate-x-1/2 shadow-md rounded flex flex-nowrap gap-1 bg-base-100">
                <ToolButton
                    icon={Undo2Icon}
                    disabled={!editState.canUndo}
                    onClick={undo}
                    tooltip="command + z"
                />
                <ToolButton
                    icon={Redo2Icon}
                    disabled={!editState.canRedo}
                    onClick={redo}
                    tooltip="command + shift + z"
                />
                <ToolDivider />
                <ToolButton
                    icon={BoldIcon}
                    disabled={!editState.canSetBold}
                    onClick={toggleBold}
                    tooltip="command + b"
                    active={editState.isBold}
                />
                <ToolButton
                    icon={ItalicIcon}
                    disabled={!editState.canSetItalic}
                    onClick={toggleItalic}
                    tooltip="command + i"
                    active={editState.isItalic}
                />
                <ToolButton
                    icon={Strikethrough}
                    disabled={!editState.canSetStrike}
                    onClick={toggleStrike}
                    tooltip="command + shift + s"
                    active={editState.isStrike}
                />
                <ToolButton
                    icon={CodeXml}
                    disabled={!editState.canSetCode}
                    onClick={toggleCode}
                    tooltip="command + e"
                    active={editState.isCode}
                />
                <ToolButton
                    icon={UnderlineIcon}
                    disabled={!editState.canSetUnderline}
                    onClick={toggleUnderline}
                    tooltip="command + u"
                    active={editState.isUnderline}
                />
                <ToolButton
                    icon={PaintBucket}
                    disabled={!editState.canSetHighlight}
                    onClick={toggleHighlight}
                    tooltip="command + h"
                    active={editState.isHighlight}
                />
                <div
                    class="dropdown dropdown-top dropdown-center"
                    classList={{
                        "dropdown-open": editState.isLink,
                    }}
                >
                    <div
                        tabIndex={0}
                        role="button"
                        class="btn btn-square btn-ghost btn-sm"
                        classList={{
                            "btn-active btn-primary": editState.isLink,
                            "btn-disabled": !editState.canSetLink(tempLink()),
                        }}
                    >
                        <Icon icon={LinkIcon} />
                    </div>
                    <div
                        tabIndex="-1"
                        class="dropdown-content menu menu-sm bg-base-100 rounded-box z-1 w-72 p-2 shadow-sm"
                    >
                        <div class="flex items-center gap-1">
                            <input
                                type="text"
                                placeholder="https://example.com"
                                class="input input-sm"
                                value={tempLink()}
                                oninput={(e) => setTempLink(e.target.value)}
                            />
                            <div class="w-0.5 h-4 bg-base-200 rounded mx-1 my-auto"></div>
                            <button
                                class="btn btn-square btn-ghost btn-sm"
                                onclick={() => setLink(tempLink())}
                            >
                                <Icon icon={CheckIcon} />
                            </button>
                            <button
                                class="btn btn-square btn-ghost btn-sm"
                                onclick={() => unSetLink()}
                            >
                                <Icon icon={X} />
                            </button>
                        </div>
                    </div>
                </div>
                <ToolDivider />
                <ToolButton
                    icon={SuperscriptIcon}
                    disabled={!editState.canSetSuperscript}
                    onClick={toggleSuperscript}
                    tooltip="command + ."
                    active={editState.isSuperscript}
                />
            </div>
        </div>
    );
}
