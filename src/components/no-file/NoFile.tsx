import { open } from '@tauri-apps/plugin-dialog';
import { readDir, readTextFile } from '@tauri-apps/plugin-fs';
import toast from 'solid-toast';

export type OpenFile = {
    path: string;
    name: string;
    content: string;
}

type Props = {
    onOpenFile: (file: OpenFile) => void;
}

export function NoFile(props: Props) {
    const openFile = async () => {
        const filePath = await open({
            multiple: false,
            filters: [
                {
                    extensions: ["md", "markdown"],
                    name: "Markdown files",
                }
            ]
        });
        
        if (filePath) {
            try {
                const entries = await readDir(filePath);
                console.log(entries);
            } catch (error) {
                try {
                    const content = await readTextFile(filePath);
                    // 返回文件真实内容
                    props.onOpenFile({
                        path: filePath,
                        name: filePath.split("/").pop() || "",
                        content,
                    });
                } catch (e2) {
                    toast.error(`Failed to read ${filePath} as a directory or file`);
                    console.error(`Failed to read ${filePath} as a directory or file`, e2);
                }
            }
        }
    }

    return (
        <div class="flex flex-col justify-center gap-4">
            <p class="text-center">You have not selected any files or folders yet.</p>
            <button class="btn btn-primary btn-dash" onclick={openFile}>Open file or folder</button>
        </div>
    )
}