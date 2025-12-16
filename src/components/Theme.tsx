import { Palette } from "lucide-solid";
import { For } from "solid-js";
import { Icon } from "./Icon";

export function Theme() {
    const themes = [
        "default",
        "light",
        "dark",
        "cupcake",
        "bumblebee",
        "emerald",
        "corporate",
        "synthwave",
        "retro",
        "cyberpunk",
        "valentine",
        "halloween",
        "garden",
        "forest",
        "aqua",
        "lofi",
        "pastel",
        "fantasy",
        "wireframe",
        "black",
        "luxury",
        "dracula",
        "cmyk",
        "autumn",
        "business",
        "acid",
        "lemonade",
        "night",
        "coffee",
        "dim",
        "nord",
        "sunset",
        "caramellatte",
        "abyss",
        "silk",
        "winter",
    ];
    const onThemeChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const theme = target.value;
        localStorage.setItem("theme", theme);
    };

    return (
        <div class="dropdown dropdown-top dropdown-left p-0">
            <button
                tabIndex={0}
                role="button"
                class="btn btn-ghost btn-xs btn-square"
            >
                <Icon icon={Palette} />
            </button>
            <ul
                tabIndex={0}
                class="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm max-h-40 overflow-y-auto flex-nowrap"
            >
                <For each={themes}>
                    {(item) => (
                        <li>
                            <input
                                type="radio"
                                name="theme-buttons"
                                class="btn theme-controller btn-xs btn-ghost"
                                aria-label={item}
                                value={item}
                                onChange={onThemeChange}
                                checked={localStorage.getItem("theme") === item}
                            />
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
}
