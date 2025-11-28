import { open } from "@tauri-apps/plugin-dialog";
import { readDir, readTextFile } from "@tauri-apps/plugin-fs";
import toast from "solid-toast";

export type OpenFile = {
    path: string;
    name: string;
    content: string;
};

export async function readFileOrFolder(onOpen: (file: OpenFile) => void) {
    const filePath = await open({
            multiple: false,
            filters: [
                {
                    extensions: ["md", "markdown"],
                    name: "Markdown files",
                },
            ],
        });

        if (filePath) {
            try {
                const entries = await readDir(filePath);
                console.log(entries);
            } catch (error) {
                try {
                    const content = await readTextFile(filePath);
                    // 返回文件真实内容
                    onOpen({
                        path: filePath,
                        name: filePath.split("/").pop() || "",
                        content,
                    });
                } catch (e2) {
                    toast.error(
                        `Failed to read ${filePath} as a directory or file`,
                    );
                    console.error(
                        `Failed to read ${filePath} as a directory or file`,
                        e2,
                    );
                }
            }
        }
}
