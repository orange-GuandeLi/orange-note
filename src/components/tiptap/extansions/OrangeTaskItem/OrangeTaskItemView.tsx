import { SolidNodeViewRendererProps } from "../../../SolidNodeView";

export function OrangeTaskItemView(props: SolidNodeViewRendererProps) {
    return (
        <>
            <div class="peer flex items-center mt-0.5">
                <input
                    contentEditable={false}
                    type="checkbox"
                    checked={props.node.attrs.checked}
                    class="checkbox checkbox-primary checkbox-xs"
                    onChange={(e) =>
                        props.updateAttributes({
                            checked: e.target.checked,
                        })
                    }
                />
            </div>
            <div
                class="text-gray-900 dark:text-gray-100 peer-has-checked:line-through peer-has-checked:text-base-300 min-h-full min-w-1"
                ref={props.contentRef}
            ></div>
        </>
    );
}
