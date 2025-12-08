import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import "highlight.js/styles/atom-one-dark.min.css";
import { SolidNodeView } from "../../../SolidNodeView";
import { OrangeCodeBlockView } from "./OrangeCodeBlockView";

const lowlight = createLowlight(all);
export const CodeBlockLanguages = [
    {
        label: "HTML",
        value: "html",
    },
    {
        label: "CSS",
        value: "css",
    },
    {
        label: "JavaScript",
        value: "js",
    },
    {
        label: "TypeScript",
        value: "ts",
    },
    {
        label: "Bash",
        value: "bash",
    },
    {
        label: "Plain Text",
        value: "plaintext",
    }
].sort((a, b) => a.label.localeCompare(b.label));

export const OrangeCodeBlock = CodeBlockLowlight.configure({
    defaultLanguage: "plaintext",
    lowlight,
}).extend({
    addNodeView() {
        return (props) => {
            return new SolidNodeView(OrangeCodeBlockView, props);
        };
    },
});
