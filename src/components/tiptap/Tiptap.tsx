import { createTiptapEditor } from "solid-tiptap";
import { onCleanup, onMount } from "solid-js";

type Props = {
    content: string;
    onSave: (content: string) => Promise<boolean>;
    active: boolean;
};

export function Tiptap(props: Props) {
    let ref: HTMLDivElement | undefined;

    const editor = createTiptapEditor(() => ({
        element: ref!,
        extensions: [
        ],
        editorProps: {
            attributes: {
                class: "size-full focus:outline-none text-sm",
            },
        },
    }));

    const handleKeyDown = async (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "s") {
            e.preventDefault();
            await handleSave();
        }
    };

    const handleSave = async () => {

    };

    onMount(() => {
        ref?.addEventListener("keydown", handleKeyDown);
    });

    onCleanup(() => {
        ref?.removeEventListener("keydown", handleKeyDown);
        editor()?.destroy();
    });

    return (
        <div class="relative size-full px-6 py-2" classList={{
            "block": props.active,
            "hidden": !props.active,
        }}>
            <div
                id="editor"
                class="h-full w-full overflow-auto"
                ref={ref}
            ></div>
        </div>
    );
}