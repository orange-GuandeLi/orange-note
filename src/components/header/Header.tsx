import { MenuIcon } from "lucide-solid";
import { Theme } from "./Theme";

export function Header() {
    return (
        <header class="navbar bg-base-100 shadow-sm gap-4">
            <div class="flex-none">
                <button class="btn btn-square btn-ghost">
                    <MenuIcon />
                </button>
            </div>
            <div class="flex-1 text-lg text-primary font-bold">Orange Note</div>
            <div class="flex-none">
                <Theme />
            </div>
        </header>
    );
}
