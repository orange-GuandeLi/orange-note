import { Show, type JSX, type JSXElement } from "solid-js";

type Props = {
    loading?: boolean;
    children?: JSXElement;
    attrs?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
};

export function LoadingButton(props: Props) {
    return (
        <button
            {...props.attrs}
            disabled={props.loading || props.attrs?.disabled}
        >
            <Show fallback={props.children} when={props.loading}>
                <span class="loading loading-spinner"></span>
            </Show>
        </button>
    );
}
