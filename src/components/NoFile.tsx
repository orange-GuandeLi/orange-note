import { Folder } from "lucide-solid";
import { Icon } from "./Icon";

type Props = {
    onOpenFolder: () => void;
};

export function NoFile(props: Props) {
    return (
        <div class="flex flex-col justify-center gap-4">
            <p class="text-center">You have not selected any folder yet.</p>
            <button
                class="btn btn-primary btn-dash"
                onclick={props.onOpenFolder}
            >
                <Icon icon={Folder} /> Open Folder
            </button>
        </div>
    );
}
