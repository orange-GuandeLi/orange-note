import { TaskItem } from "@tiptap/extension-list";
import { SolidNodeView } from "../../../SolidNodeView";
import { OrangeTaskItemView } from "./OrangeTaskItemView";

export const OrangeTaskItem = TaskItem.extend({
    addNodeView() {
        return (props) => {
            return new SolidNodeView(OrangeTaskItemView, props);
        };
    },
});
