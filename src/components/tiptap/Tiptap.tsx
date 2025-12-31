import { createTiptapEditor } from "solid-tiptap";
import { createEffect, on, onCleanup, onMount } from "solid-js";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import { Markdown } from "@tiptap/markdown";
import { ListKit } from "@tiptap/extension-list";
import { UndoRedo } from '@tiptap/extensions/undo-redo';
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
import { BoldIcon, Redo2Icon, Undo2Icon } from "lucide-solid";
import { createStore } from "solid-js/store";

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

    const [editState, setEditState] = createStore({
        canUndo: false,
        canRedo: false,
        isBold: false,
        canSetBold: false,
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
                });
            });
        },
    }));

    createEffect(
        on(() => props.active, (active) => {
            if (active && focused) {
                setTimeout(() => {
                    editor()?.chain().focus();
                }, 0);
            }
        })
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
    const toggleBold = () => {
        editor()?.chain().focus().toggleBold().run();
    };

    return (
        <div
            class="size-full px-6 relative"
            classList={{
                block: props.active,
                hidden: !props.active,
            }}
        >
            <div class="pt-2 rounded pb-96 size-full overflow-auto">
                <article
                    id="editor"
                    ref={editorRef}
                ></article>
            </div>
            <div class="px-2 py-0.5 absolute bottom-2 left-1/2 -translate-x-1/2 shadow-md rounded flex flex-nowrap overflow-x-auto gap-1">
                <button class="btn btn-square btn-ghost btn-sm" disabled={!editState.canUndo}  onclick={undo}>
                    <Icon icon={Undo2Icon} />
                </button>
                <button class="btn btn-square btn-ghost btn-sm" disabled={!editState.canRedo}  onclick={redo}>
                    <Icon icon={Redo2Icon} />
                </button>
                <div class="w-0.5 h-4 bg-base-200 rounded mx-1 my-auto"></div>
                <button
                    class="btn btn-square btn-ghost btn-sm" onclick={toggleBold}
                    disabled={!editState.canSetBold}
                    classList={{
                        "btn-active btn-primary": editState.isBold,
                    }}
                >
                    <Icon icon={BoldIcon} />
                </button>
            </div>
        </div>
    );
}