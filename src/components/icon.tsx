import type { Component, ComponentProps } from "solid-js";
import { Dynamic } from "solid-js/web";

type Props = {
    icon: Component<ComponentProps<"svg">>;
    size?: "small";
} & ComponentProps<"svg">;

export function Icon(props: Props) {
    let sizeClass = "w-4 h-4";
    if (props.size == "small") {
        sizeClass = "w-3 h-3";
    }
    const classStr = props.class ? `${sizeClass} ${props.class}` : sizeClass;

    return <Dynamic component={props.icon} {...props} class={classStr} />;
}
