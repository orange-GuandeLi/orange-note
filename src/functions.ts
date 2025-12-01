import { open } from "@tauri-apps/plugin-dialog";
import { DirEntry, readDir, readTextFile } from "@tauri-apps/plugin-fs";
import toast from "solid-toast";

export type OpenFile = {
    path: string;
    name: string;
    content: string;
};

export type RecursiveDirEntry = DirEntry & {
    children?: RecursiveDirEntry[];
    path: string;
};

export async function readFile() {
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
        return await getFileContent(filePath);
    }
}

export async function readFolder() {
    const folderPath = await open({
        multiple: false,
        directory: true,
    });

    if (folderPath) {
        return await getFolderContent(folderPath);
    }
}

export async function getFileContent(filePath: string) {
    try {
        const content = await readTextFile(filePath);
        // 返回文件真实内容
        return {
            path: filePath,
            name: filePath.split("/").pop() || "",
            content,
        };
    } catch (e2) {
        toast.error(
            `Failed to read ${filePath} as a file`,
        );
        console.error(
            `Failed to read ${filePath} as a file`,
            e2,
        );
    }
}

async function getFolderContent(folderPath: string) {
    try {
        const files = await readDirRecursively(folderPath);
        if (!files) {
            return;
        }
       return files;
    } catch (e2) {
        toast.error(
            `Failed to read ${folderPath} as a directory`,
        );
        console.error(
            `Failed to read ${folderPath} as a directory`,
            e2,
        );
    }
}


async function readDirRecursively(folderPath: string): Promise<RecursiveDirEntry[] | undefined> {
    try {
        const files = await readDir(folderPath);
        const recursiveFiles = await Promise.all(
            files.map(async (file) => {
                // 保留完整路径
                const fullPath = `${folderPath}/${file.name}`;
                return {
                    ...file,
                    path: fullPath,
                    children: file.isDirectory
                        ? await readDirRecursively(fullPath)
                        : undefined
                };
            })
        );
        const flatArray = recursiveFiles.flat();
        return flatArray.filter((item) => {
            const extension = item.name.split(".").pop();
            return extension === "md" || extension === "markdown" || item.isDirectory;
        }).sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) {
                return -1;
            }
            if (!a.isDirectory && b.isDirectory) {
                return 1;
            }
            return 0;
        });
    } catch (e2) {
        toast.error(
            `Failed to read ${folderPath} as a directory`,
        );
        console.error(
            `Failed to read ${folderPath} as a directory`,
            e2,
        );
    }
}