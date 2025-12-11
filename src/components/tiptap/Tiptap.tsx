import { createTiptapEditor } from "solid-tiptap";
import { createEffect, onCleanup, onMount } from "solid-js";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import { Markdown } from "@tiptap/markdown";
import { ListKit } from "@tiptap/extension-list";
import History from "@tiptap/extension-history";
import { OrangeTaskItem } from "./extansions/OrangeTaskItem/OrangeTaskItem";
import { OrangeCodeBlock } from "./extansions/OrangeCodeBlock/OrangeCodeBlock";
import Typography from "@tiptap/extension-typography";
import Code from "@tiptap/extension-code";
import Heading from "@tiptap/extension-heading";
import { Placeholder, Dropcursor } from "@tiptap/extensions";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import BlockQuote from "@tiptap/extension-blockquote";
import Bold from '@tiptap/extension-bold';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';



import "./tiptap.css";
import { saveImage } from "../../functions";
import toast from "solid-toast";

type Props = {
    content: string;
    onSave: (content: string) => void;
    onFileDirty: (isDirty: boolean) => void;
    active: boolean;
    basePath: string;
};

export function Tiptap(props: Props) {
    let editorRef: HTMLDivElement | undefined;
    let dirtyTimeoutId: number | undefined;
    let cursorPosition: number | undefined;
    let originalContent = props.content;

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
            History,
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
        onBlur: ({ editor }) => {
            // 存储光标位置
            const selection = editor.state.selection;
            if (selection) {
                cursorPosition = selection.$anchor.pos;
            }
        },
        onFocus: ({ editor }) => {
            // 恢复光标位置
            if (cursorPosition) {
                editor?.commands.setTextSelection(cursorPosition);
            } else if (!cursorPosition && !props.content) {
                editor?.commands.setTextSelection(0);
            }
        },
    }));

    createEffect(() => {
        if (props.active && (cursorPosition || !props.content)) {
            setTimeout(() => {
                editor()?.commands.focus();
            }, 0);
        }
    });

    const handleKeyDown = async (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "s") {
            e.preventDefault();
            // 保存内容
            originalContent = editor()?.getMarkdown() || "";
            props.onSave(originalContent);
        }
    };

    onMount(() => {
        editorRef?.addEventListener("keydown", handleKeyDown);
    });

    onCleanup(() => {
        editorRef?.removeEventListener("keydown", handleKeyDown);
        editor()?.destroy();
    });

    return (
        <div
            class="size-full px-6 py-2"
            classList={{
                block: props.active,
                hidden: !props.active,
            }}
        >
            <article
                id="editor"
                class="size-full overflow-auto"
                ref={editorRef}
            ></article>
        </div>
    );
}
