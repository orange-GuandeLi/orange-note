import { ChevronDown } from "lucide-solid";
import { Icon } from "../../../Icon";
import { SolidNodeViewRendererProps } from "../../../SolidNodeView";
import { CodeBlockLanguages } from "./OrangeCodeBlock";
import { createMemo } from "solid-js";

export function OrangeCodeBlockView(props: SolidNodeViewRendererProps) {
    const language = createMemo(
        () =>
            CodeBlockLanguages.find(
                (lang) => lang.value === props.node.attrs.language,
            )?.label || "Plain Text",
    );

    return (
        <pre class="bg-gray-900 dark:bg-gray-100 mb-2 mt-8 p-2 rounded text-gray-100 dark:text-gray-900 relative">
            <code
                ref={props.contentRef}
                class={`language-${props.node.attrs.language} bg-transparent`}
            >
            </code>
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
        </pre>
    );
}
