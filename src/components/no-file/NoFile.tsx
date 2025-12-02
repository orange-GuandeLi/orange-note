import { File, Folder } from "lucide-solid";
import { Icon } from "../icon";

type Props = {
    onOpenFile: () => void;
    onOpenFolder: () => void;
};

export function NoFile(props: Props) {
    return (
        <div class="flex flex-col justify-center gap-4">
            <p class="text-center">
                You have not selected any files or folders yet.
            </p>
            <button class="btn btn-primary btn-dash" onclick={props.onOpenFile}>
                <Icon icon={File} /> Open File
            </button>
            <button
                class="btn btn-primary btn-dash"
                onclick={props.onOpenFolder}
            >
                <Icon icon={Folder} /> Open Folder
            </button>
        </div>
    );
}
