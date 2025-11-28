import { File, Folder } from "lucide-solid";
import { OpenFile, readFile, readFolder, RecursiveDirEntry } from "../../functions";
import { Icon } from "../icon";

type Props = {
    onOpenFile: (file: OpenFile) => void;
    onOpenFolder: (files: RecursiveDirEntry[]) => void;
};

export function NoFile(props: Props) {
    const openFile = async () => {
        const content = await readFile();
        if (content) {
            props.onOpenFile(content);
        }
    };
    const openFolder = async () => {
        const files = await readFolder();
        if (files) {
            props.onOpenFolder(files);
        }
    }

    return (
        <div class="flex flex-col justify-center gap-4">
            <p class="text-center">
                You have not selected any files or folders yet.
            </p>
            <button class="btn btn-primary btn-dash" onclick={openFile}>
                <Icon icon={File} /> Open File
            </button>
            <button class="btn btn-primary btn-dash" onclick={openFolder}>
                <Icon icon={Folder} /> Open Folder
            </button>
        </div>
    );
}
