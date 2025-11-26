import { createTiptapEditor } from "solid-tiptap";
import StarterKit from "@tiptap/starter-kit";

// 导入所有新插件
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

export function Tiptap() {
    let ref: HTMLDivElement | undefined;

    createTiptapEditor(() => ({
        element: ref!,
        extensions: [
            StarterKit,
            Underline,
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
            Link.configure({
                openOnClick: false, // 在桌面应用中，通常我们希望自己处理链接点击
                autolink: true, // 自动将 URL 转换为链接
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"], // 允许对标题和段落设置对齐
            }),
            Placeholder.configure({
                placeholder: "在此处开始写作...", // 编辑器为空时显示的占位符
            }),
        ],
        content: `<p>Example Text</p>`,
        editorProps: {
            attributes: {
                class: "w-full h-full w-full focus:outline-none",
            },
        },
    }));

    return <div id="editor" class="h-full w-full p-8 overflow-auto" ref={ref}></div>;
}
