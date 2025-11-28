import { createTiptapEditor } from "solid-tiptap";
import StarterKit from "@tiptap/starter-kit";
import { createEffect, createSignal, on, onCleanup, onMount } from "solid-js";
// 导入所有新插件
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
import { PasteMarkdown } from "./extansions/pasteMarkdown";
import { CircleAlert, CircleCheck } from "lucide-solid";
import { Icon } from "../icon";

type Props = {
    content: string;
    onSave: (content: string) => Promise<boolean>;
};

export function Tiptap(props: Props) {
    let ref: HTMLDivElement | undefined;
    const [isDirty, setIsDirty] = createSignal(false);
    let originalContent = props.content;

    const editor = createTiptapEditor(() => ({
        element: ref!,
        extensions: [
            StarterKit,
            Markdown,
            PasteMarkdown,
            Highlight,
            TaskList,
            TaskItem.configure({
                nested: true, // 允许任务列表嵌套
            }),
            Table.configure({
                resizable: true, // 允许调整表格列宽
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image,
            TextAlign.configure({
                types: ["heading", "paragraph"], // 允许对标题和段落设置对齐
            }),
            Placeholder.configure({
                placeholder: "在此处开始写作...", // 编辑器为空时显示的占位符
            }),
        ],
        editorProps: {
            attributes: {
                class: "size-full focus:outline-none text-sm",
            },
        },
        onUpdate: ({ editor }) => {
            const markdown = editor.getMarkdown();
            setIsDirty(markdown !== originalContent);
        },
    }));

    const handleKeyDown = async (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "s") {
            e.preventDefault();
            await handleSave();
        }
    };

    const handleSave = async () => {
        const mdContent = editor()?.getMarkdown() || "";
        // 调用接口保存文件
        if (await props.onSave(mdContent)) {
            originalContent = mdContent;
            setIsDirty(false);
        }
    };

    onMount(() => {
        ref?.addEventListener("keydown", handleKeyDown);
    });

    createEffect(
        on(
            () => props.content,
            (content) => {
                const e = editor();
                if (!e) {
                    return;
                }

                if (e.isDestroyed) {
                    return;
                }

                if (content === e.getMarkdown()) {
                    return;
                }

                e.commands.setContent(e.markdown?.parse(content) || "");
                e.commands.focus("end");
            },
        ),
    );

    onCleanup(() => {
        ref?.removeEventListener("keydown", handleKeyDown);
        editor()?.destroy();
    });

    return (
        <div class="relative size-full">
            <div
                id="editor"
                class="h-full w-full p-6 overflow-auto"
                ref={ref}
            ></div>
            {isDirty() ? (
                <div class="absolute bottom-4 right-4 badge badge-sm badge-dash badge-error">
                    <Icon icon={CircleAlert} size="small" />
                    Unsynchronized
                </div>
            ) : (
                <div class="absolute bottom-4 right-4 badge badge-sm badge-dash badge-success">
                    <Icon icon={CircleCheck} size="small" />
                    Synchronized
                </div>
            )}
        </div>
    );
}