import { open } from '@tauri-apps/plugin-dialog';

export function NoFile() {
    const openFile = async () => {
        const file = await open({
            multiple: false,
        });
        console.log(file);
    }

    return (
        <div class="flex flex-col justify-center gap-4">
            <p class="text-center">You have not selected any files or folders yet.</p>
            <button class="btn btn-primary btn-dash" onclick={openFile}>Open file or folder</button>
        </div>
    )
}