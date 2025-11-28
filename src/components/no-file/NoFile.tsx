import { OpenFile, readFileOrFolder } from "../../functions";

type Props = {
    onOpenFile: (file: OpenFile) => void;
};

export function NoFile(props: Props) {
    const openFile = async () => {
        await readFileOrFolder(props.onOpenFile);
    };

    return (
        <div class="flex flex-col justify-center gap-4">
            <p class="text-center">
                You have not selected any files or folders yet.
            </p>
            <button class="btn btn-primary btn-dash" onclick={openFile}>
                Open File or Folder
            </button>
        </div>
    );
}
