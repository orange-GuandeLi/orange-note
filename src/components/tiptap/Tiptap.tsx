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
import { OrangeCode } from "./extansions/OrangeCode";
import { OrangeHeading } from "./extansions/OrangeHeading";

type Props = {
    content: string;
    onSave: (content: string) => void;
    onFileDirty: (isDirty: boolean) => void;
    active: boolean;
};

export function Tiptap(props: Props) {
    let editorRef: HTMLDivElement | undefined;
    let dirtyTimeoutId: number | undefined;
    let cursorPosition: number | undefined;
    let originalContent = props.content;

    const editor = createTiptapEditor(() => ({
        element: editorRef!,
        content: props.content,
        contentType: "markdown",
        extensions: [
            Document,
            Paragraph,
            Text,
            Markdown,
            ListKit.configure({
                taskItem: false,
            }),
            History,

            OrangeTaskItem,
            OrangeCode,
            OrangeCodeBlock,
            OrangeHeading,
        ],
        editorProps: {
            attributes: {
                class: "size-full focus:outline-none text-sm",
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
            }, 500);
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
            }
        },
    }));

    createEffect(() => {
        if (props.active && cursorPosition) {
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
