import { createTiptapEditor } from "solid-tiptap";
import StarterKit from "@tiptap/starter-kit";
import { createEffect, on, onCleanup } from "solid-js";
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

type Props = {
    content: string;
}

export function Tiptap(props: Props) {
    let ref: HTMLDivElement | undefined;

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
                class: "w-full h-full focus:outline-none",
            },
        },
    }));

    createEffect(
        on(() => props.content, (content) => {
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
        }),
    );

    onCleanup(() => {
        editor()?.destroy();
    });

    return (
        <div
            id="editor"
            class="h-full w-full p-4 overflow-auto"
            ref={ref}
        ></div>
    );
}