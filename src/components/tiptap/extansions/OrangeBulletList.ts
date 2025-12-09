import { BulletList } from "@tiptap/extension-list";
import { splitClassName } from "../../../functions";

export const OrangeBulletList = BulletList.extend({
    addNodeView() {
        return () => {
            const ul = document.createElement("ul");
            ul.classList.add(...splitClassName("list-disc list-inside"));
            return {
                dom: ul,
                contentDOM: ul,
            }
        };
    },
});