import Heading from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";

export const OrangeHeading = Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level);
        const level = hasLevel ? node.attrs.level : this.options.levels[0];

        return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: getHeadingClass(level),
            }),
            0,
        ];
    },
});

function getHeadingClass(level: number) {
    let className = "text-2xl";
    switch (level) {
        case 1:
            className = "text-5xl";
            break;
        case 2:
            className = "text-4xl";
            break;
        case 3:
            className = "text-3xl";
            break;
        case 4:
            className = "text-2xl";
            break;
        case 5:
            className = "text-lg";
            break;
        case 6:
            className = "text-base";
            break;
        default:
            className = "text-2xl";
    }

    return `${className} font-bold my-2`;
}
