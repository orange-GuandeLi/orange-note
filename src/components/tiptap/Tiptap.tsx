import { createTiptapEditor } from "solid-tiptap";
import { onCleanup, onMount } from "solid-js";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import { Markdown } from "@tiptap/markdown";
import Heading from "@tiptap/extension-heading";
import { TaskList, TaskItem } from '@tiptap/extension-list'

type Props = {
    content: string;
    onSave: (content: string) => void;
    onFileDirty: (isDirty: boolean) => void;
    active: boolean;
};

export function Tiptap(props: Props) {
    let ref: HTMLDivElement | undefined;
    let dirtyTimeoutId: number | undefined;

    const editor = createTiptapEditor(() => ({
        element: ref!,
        content: props.content,
        contentType: "markdown",
        extensions: [
            Document,
            Paragraph,
            Text,
            Markdown,
            Heading,
            TaskList,
            TaskItem,
        ],
        editorProps: {
            attributes: {
                class: "size-full focus:outline-none text-sm",
            },
        },
        onUpdate: ({ editor }) => {
            if (dirtyTimeoutId) {
                clearTimeout(dirtyTimeoutId);
            }

            dirtyTimeoutId = setTimeout(() => {
                const orignalContent = editor.markdown?.parse(props.content);
                const draft = editor.getJSON();
                props.onFileDirty(JSON.stringify(draft) != JSON.stringify(orignalContent));
            }, 500);
        },
    }));

    const handleKeyDown = async (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "s") {
            e.preventDefault();
            await handleSave();
        }
    };

    const handleSave = async () => {};

    onMount(() => {
        ref?.addEventListener("keydown", handleKeyDown);
    });

    onCleanup(() => {
        ref?.removeEventListener("keydown", handleKeyDown);
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
            <div id="editor" class="size-full overflow-auto" ref={ref}></div>
        </div>
    );
}