import { ChevronDown, Heading, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from "lucide-solid";
import { Icon } from "../../Icon"
import { Component, ComponentProps, createEffect, createSignal, For, onMount } from "solid-js";
import { Level } from "@tiptap/extension-heading";

type Prop = {
    headLevel?: Level;
    canSetHead: (level: Level) => boolean;
    toggleHead: (level: Level) => void;
}

export function HeadMenu(props: Prop) {
    const [headIcon, setHeadIcon] = createSignal(Heading);

    createEffect(() => {
        if (props.headLevel == 1) {
            setHeadIcon(() => Heading1);
        } else if (props.headLevel == 2) {
            setHeadIcon(() => Heading2);
        } else if (props.headLevel == 3) {
            setHeadIcon(() => Heading3);
        } else if (props.headLevel == 4) {
            setHeadIcon(() => Heading4);
        } else if (props.headLevel == 5) {
            setHeadIcon(() => Heading5);
        } else if (props.headLevel == 6) {
            setHeadIcon(() => Heading6);
        } else {
            setHeadIcon(() => Heading);
        }
    })

    const headItems: {
        level: Level;
        icon: Component<ComponentProps<"svg">>;
    }[] = [
        {
            level: 1,
            icon: Heading1,
        },
        {
            level: 2,
            icon: Heading2,
        },
        {
            level: 3,
            icon: Heading3,
        },
        {
            level: 4,
            icon: Heading4,
        },
        {
            level: 5,
            icon: Heading5,
        },
        {
            level: 6,
            icon: Heading6,
        },
    ];

    const canSetHead = () => props.canSetHead(1) || props.canSetHead(2) || props.canSetHead(3) || props.canSetHead(4) || props.canSetHead(5) || props.canSetHead(6);

    return (
        <div
            class="dropdown dropdown-top dropdown-center"
        >
            <div
                tabIndex={0}
                role="button"
                class="btn btn-square btn-ghost btn-sm gap-0"
                classList={{
                    "btn-active btn-primary": props.headLevel !== undefined,
                    "btn-disabled": !canSetHead,
                }}
            >
                <Icon icon={headIcon()} size="small" />
                <Icon icon={ChevronDown} size="small" />
            </div>
            <ul
                tabIndex="-1"
                class="dropdown-content menu menu-sm bg-base-100 rounded-box z-1 p-2 shadow-sm"
            >
                <li>
                    <For each={headItems}>
                        {({ level, icon }) => (
                            <a
                                class="whitespace-nowrap"
                                onclick={() => {
                                    props.toggleHead(level);
                                }}
                                classList={{
                                    "menu-active": props.headLevel == level,
                                }}>
                                <Icon icon={icon} /> Head {level}
                            </a>
                        )}
                    </For>
                </li>
            </ul>
        </div>
    )
}