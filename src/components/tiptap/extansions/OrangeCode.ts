import { mergeAttributes } from "@tiptap/core";
import Code from "@tiptap/extension-code";

export const OrangeCode = Code.extend({
    renderHTML({ HTMLAttributes }) {
        return ["code", mergeAttributes(HTMLAttributes, { class: "bg-base-200 px-1 rounded" }), 0];
    }
});