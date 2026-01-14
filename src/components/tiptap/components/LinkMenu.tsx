import { CheckIcon, LinkIcon, X } from "lucide-solid";
import { Icon } from "../../Icon";

type Prop = {
    isLink: boolean;
    canSetLink: (link: string) => boolean;
    setLink: (link: string) => void;
    unSetLink: () => void;
    tempLink: string;
    setTempLink: (link: string) => void;
}

export function LinkMenu(props: Prop) {
    return (
        <div
            class="dropdown dropdown-top dropdown-center"
            classList={{
                "dropdown-open": props.isLink,
            }}
        >
            <div
                tabIndex={0}
                role="button"
                class="btn btn-square btn-ghost btn-sm"
                classList={{
                    "btn-active btn-primary": props.isLink,
                    "btn-disabled": !props.canSetLink(props.tempLink),
                }}
            >
                <Icon icon={LinkIcon} />
            </div>
            <div
                tabIndex="-1"
                class="dropdown-content menu menu-sm bg-base-100 rounded-box z-1 w-72 p-2 shadow-sm"
            >
                <div class="flex items-center gap-1">
                    <input
                        type="text"
                        placeholder="https://example.com"
                        class="input input-sm"
                        value={props.tempLink}
                        oninput={(e) => props.setTempLink(e.target.value)}
                    />
                    <div class="w-0.5 h-4 bg-base-200 rounded mx-1 my-auto"></div>
                    <button
                        class="btn btn-square btn-ghost btn-sm"
                        onclick={() => props.setLink(props.tempLink)}
                    >
                        <Icon icon={CheckIcon} />
                    </button>
                    <button
                        class="btn btn-square btn-ghost btn-sm"
                        onclick={() => props.unSetLink()}
                    >
                        <Icon icon={X} />
                    </button>
                </div>
            </div>
        </div>
    );
}
