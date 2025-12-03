import { open } from "@tauri-apps/plugin-dialog";
import { DirEntry, readDir, readTextFile } from "@tauri-apps/plugin-fs";

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
            name: getFileName(filePath),
            content,
        };
    } catch (e2) {
        console.error(`Failed to read ${filePath} as a file`, e2);
        throw e2;
    }
}

export async function getFolderContent(folderPath: string) {
    try {
        const files = await readDirRecursively(folderPath);
        if (!files) {
            return;
        }
        return {
            isDirectory: true,
            isFile: false,
            isSymlink: false,
            name: getFileName(folderPath),
            path: folderPath,
            children: files,
        };
    } catch (e2) {
        console.error(`Failed to read ${folderPath} as a directory`, e2);
        throw e2;
    }
}

async function readDirRecursively(
    folderPath: string,
): Promise<RecursiveDirEntry[] | undefined> {
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
                        : undefined,
                };
            }),
        );
        const flatArray = recursiveFiles.flat();
        return flatArray
            .filter((item) => {
                const extension = getFileExtension(item.name);
                return (
                    extension === "md" ||
                    extension === "markdown" ||
                    item.isDirectory
                );
            })
            .sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) {
                    return -1;
                }
                if (!a.isDirectory && b.isDirectory) {
                    return 1;
                }
                return 0;
            });
    } catch (e2) {
        console.error(`Failed to read ${folderPath} as a directory`, e2);
        throw e2;
    }
}

export function getFileName(filePath: string) {
    return filePath.split("/").pop() || "";
}

export function getFileExtension(filePath: string) {
    return filePath.split(".").pop() || "";
}
