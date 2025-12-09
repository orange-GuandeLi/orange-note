import { mergeAttributes } from "@tiptap/core";
import Code from "@tiptap/extension-code";

export const OrangeCode = Code.extend({
    renderHTML({ HTMLAttributes }) {
        return [
            "code",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: "bg-base-200 px-1 rounded text-xs",
            }),
            0,
        ];
    },
});
