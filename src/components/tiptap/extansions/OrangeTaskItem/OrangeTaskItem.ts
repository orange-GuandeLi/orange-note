import { TaskItem } from "@tiptap/extension-list";
import type { Node } from "@tiptap/pm/model";
import { splitClassName } from "../../../../functions";

export const OrangeTaskItem = TaskItem.extend({
    addNodeView() {
        return ({ node, HTMLAttributes, getPos, editor }) => {
            const listItem = document.createElement("li");
            const checkboxWrapper = document.createElement("label");
            const checkboxStyler = document.createElement("span");
            const checkbox = document.createElement("input");
            checkbox.classList.add(
                ...splitClassName("checkbox checkbox-xs checkbox-primary"),
            );
            const content = document.createElement("div");

            const updateA11Y = (currentNode: Node) => {
                checkbox.ariaLabel =
                    this.options.a11y?.checkboxLabel?.(
                        currentNode,
                        checkbox.checked,
                    ) ||
                    `Task item checkbox for ${currentNode.textContent || "empty task item"}`;
            };

            updateA11Y(node);

            checkboxWrapper.contentEditable = "false";
            checkbox.type = "checkbox";
            checkbox.addEventListener("mousedown", (event) =>
                event.preventDefault(),
            );
            checkbox.addEventListener("change", (event) => {
                // if the editor isn’t editable and we don't have a handler for
                // readonly checks we have to undo the latest change
                if (!editor.isEditable && !this.options.onReadOnlyChecked) {
                    checkbox.checked = !checkbox.checked;

                    return;
                }

                const { checked } = event.target as any;

                if (editor.isEditable && typeof getPos === "function") {
                    editor
                        .chain()
                        .focus(undefined, { scrollIntoView: false })
                        .command(({ tr }) => {
                            const position = getPos();

                            if (typeof position !== "number") {
                                return false;
                            }
                            const currentNode = tr.doc.nodeAt(position);

                            tr.setNodeMarkup(position, undefined, {
                                ...currentNode?.attrs,
                                checked,
                            });

                            return true;
                        })
                        .run();
                }
                if (!editor.isEditable && this.options.onReadOnlyChecked) {
                    // Reset state if onReadOnlyChecked returns false
                    if (!this.options.onReadOnlyChecked(node, checked)) {
                        checkbox.checked = !checkbox.checked;
                    }
                }
            });

            Object.entries(this.options.HTMLAttributes).forEach(
                ([key, value]) => {
                    listItem.setAttribute(key, value);
                },
            );

            listItem.dataset.checked = node.attrs.checked;
            checkbox.checked = node.attrs.checked;

            checkboxWrapper.append(checkbox, checkboxStyler);
            listItem.append(checkboxWrapper, content);

            Object.entries(HTMLAttributes).forEach(([key, value]) => {
                listItem.setAttribute(key, value);
            });

            return {
                dom: listItem,
                contentDOM: content,
                update: (updatedNode) => {
                    if (updatedNode.type !== this.type) {
                        return false;
                    }

                    listItem.dataset.checked = updatedNode.attrs.checked;
                    checkbox.checked = updatedNode.attrs.checked;
                    updateA11Y(updatedNode);

                    return true;
                },
            };
        };
    },
});
