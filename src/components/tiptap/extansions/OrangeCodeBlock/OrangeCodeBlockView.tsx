import { ChevronDown, Copy } from "lucide-solid";
import { Icon } from "../../../Icon";
import { SolidNodeViewRendererProps } from "../../../SolidNodeView";
import { CodeBlockLanguages } from "./OrangeCodeBlock";
import { createMemo } from "solid-js";
import toast from "solid-toast";

export function OrangeCodeBlockView(props: SolidNodeViewRendererProps) {
    const language = createMemo(
        () =>
            CodeBlockLanguages.find(
                (lang) => lang.value === props.node.attrs.language,
            )?.label || "Plain Text",
    );

    return (
        <>
            <code
                ref={props.contentRef}
                class={`language-${props.node.attrs.language} bg-transparent`}
            ></code>
            <div class="absolute -top-8 left-0 flex items-center gap-2">
                <button
                    class="btn btn-xs btn-primary btn-ghost"
                    onClick={() => {
                        navigator.clipboard.writeText(props.node.textContent || "").then(() => {
                            toast.success("Code copied to clipboard");
                        });
                    }}
                >
                    <Icon icon={Copy} size="small" />
                    Copy
                </button>
            </div>
            <div
                contentEditable={false}
                class="absolute -top-8 right-0 flex items-center gap-2"
            >
                <div class="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        class="btn btn-xs btn-ghost btn-primary font-bold"
                    >
                        {language()} <Icon icon={ChevronDown} size="small" />
                    </div>
                    <ul
                        tabIndex="-1"
                        class="dropdown-content menu menu-xs rounded-sm bg-neutral rounded-box z-1 p-2 shadow-sm text-neutral-content"
                        data-type="language-switch"
                    >
                        {CodeBlockLanguages.map((lang) => (
                            <li
                                onClick={() =>
                                    props.updateAttributes({
                                        language: lang.value,
                                    })
                                }
                            >
                                <a
                                    classList={{
                                        "menu-active bg-base-100 text-base-content":
                                            lang.value ===
                                            props.node.attrs.language,
                                    }}
                                >
                                    {lang.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
