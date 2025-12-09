import { TaskItem } from "@tiptap/extension-list";
import { SolidNodeView } from "../../../SolidNodeView";
import { OrangeTaskItemView } from "./OrangeTaskItemView";
import { splitClassName } from "../../../../functions";

export const OrangeTaskItem = TaskItem.extend({
    addNodeView() {
        return (props) => {
            const li = document.createElement("li");
            // li.classList.add(...splitClassName("flex items-center gap-2"))
            return new SolidNodeView(li, OrangeTaskItemView, props);
        };
    },
});
