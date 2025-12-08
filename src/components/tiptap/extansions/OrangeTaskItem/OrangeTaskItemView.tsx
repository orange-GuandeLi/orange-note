import { SolidNodeViewRendererProps } from "../../../SolidNodeView";

export function OrangeTaskItemView(props: SolidNodeViewRendererProps) {
    return (
        <li class="flex items-center gap-2">
            <input
                type="checkbox"
                checked={props.node.attrs.checked}
                class="checkbox checkbox-primary checkbox-xs"
                onChange={(e) =>
                    props.updateAttributes({
                        checked: e.target.checked,
                    })
                }
            />
            <span class="text-gray-900 dark:text-gray-100" ref={props.contentRef}>
            </span>
        </li>
    );
}