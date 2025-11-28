import { MenuIcon } from "lucide-solid";
import { Theme } from "./Theme";
import { Icon } from "../icon";

export function Header() {
    return (
        <header class="navbar bg-base-100 shadow-sm gap-4 justify-between lg:justify-end">
            <label
                for="NavDraw"
                class="btn btn-square btn-ghost drawer-button lg:hidden"
            >
                <Icon icon={MenuIcon} />
            </label>
            <Theme />
        </header>
    );
}
