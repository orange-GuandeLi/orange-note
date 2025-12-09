import { ListItem } from "@tiptap/extension-list";
import { splitClassName } from "../../../functions";

export const OrangeListItem = ListItem.extend({
    addNodeView() {
        return () => {
            const li = document.createElement("li");
            li.classList.add(...splitClassName("flex"));
            return {
                dom: li,
                contentDOM: li,
            }
        };
    },
});