import { FilePlus } from "lucide-solid";
import { Icon } from "./Icon";
import { LoadingButton } from "./loading-button";
import toast from "solid-toast";
import { writeFile } from "@tauri-apps/plugin-fs";
import { createSignal } from "solid-js";

type Props = {
    basePath: string;
    onSuccess: (filePath: string) => void;
}

export function CreateFileModal(props: Props) {
    const [isCreating, setIsCreating] = createSignal(false);
    const [modalOpen, setModalOpen] = createSignal(false);

    return (
        <>
            {/* The button to open modal */}
            <button class="btn btn-square btn-xs btn-ghost" onclick={() => {
                setModalOpen(true);
            }}>
                <Icon icon={FilePlus} size="small" />
            </button>
            <dialog class="modal" open={modalOpen()}>
                <form class="modal-box" onsubmit={(e) => {
                    e.preventDefault();

                    if (!props.basePath) {
                        toast.error("Please select a folder first");
                        return;
                    }

                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const fileName = (formData.get("fileName") as string)?.trim();
                    if (!fileName) {
                        toast.error("Please enter a file name");
                        return;
                    }

                    setIsCreating(true);
                    const filePath = `${props.basePath}/${fileName}.md`;
                    writeFile(filePath, Uint8Array.from([])).then(() => {
                        toast.success(`File ${fileName} created successfully`);
                        props.onSuccess(filePath);
                        setModalOpen(false);
                        form.reset();
                    }).catch((e) => {
                        console.error(e);
                        toast.error(`Failed to create file ${filePath}`);
                    }).finally(() => {
                        setIsCreating(false);
                    });
                }}>
                    <h3 class="text-lg font-bold">Create New File</h3>
                    <p class="py-4">Enter the name of the new file:</p>
                    <input type="text" disabled={isCreating()} autofocus id="fileName" name="fileName" placeholder="awesome-note" class="input input-bordered w-full" />
                    <div class="modal-action">
                        <button class="btn" type="button" onclick={() => {
                            setModalOpen(false);
                        }} disabled={isCreating()}>Cancel</button>
                        <LoadingButton attrs={{
                            type: "submit",
                            class: "btn btn-primary",
                            disabled: isCreating(),
                        }} loading={isCreating()}>
                            Create
                        </LoadingButton>
                    </div>
                </form>
            </dialog>
        </>
    )
}