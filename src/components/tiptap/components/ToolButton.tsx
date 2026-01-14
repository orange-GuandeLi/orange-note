import { Component, ComponentProps } from "solid-js";
import { Icon } from "../../Icon";

export function ToolButton(props: {
    icon: Component<ComponentProps<"svg">>;
    disabled?: boolean;
    active?: boolean;
    tooltip?: string;
    onClick: () => void;
}) {
    return (
        <button
            class="btn btn-square btn-ghost btn-sm tooltip tooltip-top"
            data-tip={props.tooltip}
            disabled={props.disabled}
            onclick={props.onClick}
            classList={{
                "btn-active btn-primary": props.active,
            }}
        >
            <Icon icon={props.icon} />
        </button>
    );
}
