import { RotateCcw, X } from "lucide-solid";
import { FileList } from "./FileList";
import { Icon } from "./Icon";
import { RecentFileList } from "./RecentFileList";
import { NoFile } from "./NoFile";
import {
    createSignal,
    For,
    Match,
    onMount,
    Show,
    Switch,
    createEffect,
    createMemo,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
    getFileContent,
    getFolderContent,
    OpenFile,
    readFolder,
    RecursiveDirEntry,
} from "../functions";
import toast from "solid-toast";
import { Tiptap } from "./tiptap/Tiptap";
import { writeFile } from "@tauri-apps/plugin-fs";
import { CreateFileModal } from "./CreateFileModal";

export function Layout() {
    onMount(() => {
        const selectedFolder = localStorage.getItem("selectedFolder");
        if (selectedFolder) {
            try {
                openFolder(selectedFolder);

                // set recent files
                const recentFilesJSON = JSON.parse(
                    localStorage.getItem("recentFolders") || "[]",
                ) as RecursiveDirEntry[];
                setRecentFiles(recentFilesJSON);

                // set opend files order
                const opendFilesOrderJSON = JSON.parse(
                    localStorage.getItem("opendFilesOrder") || "[]",
                ) as string[];
                setOpendFilesOrderData(opendFilesOrderJSON);

                // set opend files
                const opendFilesJSON = JSON.parse(
                    localStorage.getItem("opendFiles") || "[]",
                ) as OpenFile[];
                setOpendFiles(opendFilesJSON);

                // set current file
                if (opendFilesOrderJSON.length > 0) {
                    handleFileClick(
                        opendFilesOrderJSON[opendFilesOrderJSON.length - 1],
                    );
                }
            } catch {
                toast.error(
                    "Faild to read folder or recent files or opend files order",
                );
            }
        }
    });

    const [selectedFolder, setSelectedFolder] = createSignal<
        RecursiveDirEntry | undefined
    >();
    const [recentFiles, setRecentFiles] = createSignal<RecursiveDirEntry[]>([]);
    const [currentFile, setCurrentFile] = createSignal<OpenFile | undefined>();
    const [opendFiles, setOpendFiles] = createStore<OpenFile[]>([]);
    const [dirtyFiles, setDirtyFiles] = createSignal<string[]>([]);
    const [currentActiveFileOrFolder, setCurrentActiveFileOrFolder] =
        createSignal<
            | {
                  isFile: boolean;
                  path: string;
              }
            | undefined
        >();
    let opendFilesOrder: string[] = [];

    createEffect(() => {
        localStorage.setItem(
            "opendFiles",
            JSON.stringify(
                opendFiles.map((item) => ({
                    ...item,
                    content: "",
                })),
            ),
        );
    });

    createEffect(() => {
        const folder = selectedFolder();
        if (!folder) {
            return;
        }
        localStorage.setItem("selectedFolder", folder.path);
        try {
            const recentFolders = JSON.parse(
                localStorage.getItem("recentFolders") || "[]",
            ) as RecursiveDirEntry[];
            // Remove duplicates
            const uniqueFolders = recentFolders.filter(
                (f) => f.path !== folder.path,
            );
            const newRecentFolders = [folder, ...uniqueFolders];
            localStorage.setItem(
                "recentFolders",
                JSON.stringify(newRecentFolders),
            );
            setRecentFiles(newRecentFolders);
        } catch {
            toast.error("Failed to update recent folders");
        }
    });

    const  openFolder = async (path: string) => {
        // open folder
        const folder = await getFolderContent(path);
        setSelectedFolder(folder);
    }

    const setOpendFilesOrderData = (order: string[]) => {
        opendFilesOrder = order;
        localStorage.setItem(
            "opendFilesOrder",
            JSON.stringify(opendFilesOrder),
        );
    };

    const handleFileClick = (filePath: string) => {
        // 更新当前激活路径
        setCurrentActiveFileOrFolder({
            isFile: true,
            path: filePath,
        });

        if (currentFile()?.path === filePath) {
            return;
        }

        // 记录一个文件打开顺序栈
        setOpendFilesOrderData([...opendFilesOrder, filePath]);

        // 读取文件更新content
        try {
            getFileContent(filePath).then((file) => {
                const fileIndex = opendFiles.findIndex(
                    (item) => item.path === filePath,
                );
                if (fileIndex === -1) {
                    setOpendFiles([...opendFiles, file]);
                } else {
                    setOpendFiles(fileIndex, "content", file.content);
                }
                setCurrentFile(
                    opendFiles.find((item) => item.path === filePath),
                );
            });
        } catch {
            toast.error("Failed to read file");
        }
    };

    const handleOpenFolder = () => {
        try {
            readFolder().then((folder) => {
                if (folder) {
                    setSelectedFolder(folder);
                }
            });
        } catch {
            toast.error("Failed to read folder");
        }
    };

    const handleOpenFileOrFolder = (file: RecursiveDirEntry) => {
        if (file.isDirectory) {
            try {
                getFolderContent(file.path).then((folder) => {
                    setSelectedFolder(folder);
                });
            } catch {
                toast.error("Failed to read folder");
            }
        }
    };

    const handleCloseFile = (filePath: string) => {
        const newOpendFiles = opendFiles.filter(
            (item) => item.path !== filePath,
        );
        setOpendFiles(newOpendFiles);

        // 记录一个文件关闭顺序栈
        const newOpendFilesOrder = opendFilesOrder.filter(
            (item) => item !== filePath,
        );
        setOpendFilesOrderData(newOpendFilesOrder);
        // 关闭文件后，设置当前文件为最近打开的文件，
        // 如果最近打开的文件被关闭了，就找倒数第二个最近打开的文件
        if (currentFile()?.path === filePath) {
            if (newOpendFilesOrder.length > 0) {
                const lastFilePath =
                    newOpendFilesOrder[newOpendFilesOrder.length - 1];
                const newCurrentFile = newOpendFiles.find(
                    (item) => item.path === lastFilePath,
                );
                setCurrentFile(newCurrentFile);
            } else {
                setCurrentFile(undefined);
            }
        }
    };

    const handleSetFileDirty = (filePath: string, isDirty: boolean) => {
        if (isDirty) {
            setDirtyFiles((prev) => [...prev, filePath]);
        } else {
            setDirtyFiles((prev) => prev.filter((item) => item !== filePath));
        }
    };

    const handleSaveFile = (filePath: string, content: string) => {
        try {
            writeFile(filePath, new TextEncoder().encode(content)).then(() => {
                toast.success("File saved");
                handleSetFileDirty(filePath, false);
            });
        } catch {
            toast.error("Failed to save file");
        }
    };

    const basePath = createMemo(() => {
        const currentActive = currentActiveFileOrFolder();
        if (currentActive) {
            if (currentActive.isFile) {
                return (
                    currentActive.path.split("/").slice(0, -1).join("/") || ""
                );
            } else {
                return currentActive.path || "";
            }
        }
        return selectedFolder()?.path || "";
    });

    return (
        <div class="size-full flex">
            <aside class="w-54 min-w-54 resize-x overflow-x-auto shadow flex flex-col">
                <Show
                    when={selectedFolder()}
                    fallback={
                        <div class="p-4">
                            <NoFile onOpenFolder={handleOpenFolder} />
                        </div>
                    }
                >
                    <div class="h-10 shadow shrink-0 flex items-center p-2 text-sm justify-between">
                        <span
                            class="truncate min-w-0"
                            title="folder name name name name name"
                        >
                            {selectedFolder()!.name || ""}
                        </span>
                        <div class="shrink-0">
                            <CreateFileModal
                                basePath={basePath()}
                                onSuccess={async (path) => {
                                    await openFolder(selectedFolder()!.path);
                                    handleFileClick(path);
                                }}
                            />
                            {/* <button class="btn btn-square btn-xs btn-ghost">
                                <Icon icon={FolderPlus} size="small" />
                            </button> */}
                            <button
                                class="btn btn-square btn-xs btn-ghost"
                                onClick={async () => {
                                    await openFolder(selectedFolder()!.path);
                                }}
                            >
                                <Icon icon={RotateCcw} size="small" />
                            </button>
                        </div>
                    </div>
                    <div class="menu flex-1 min-h-0 overflow-y-auto w-full">
                        <FileList
                            files={selectedFolder()!.children || []}
                            onFileClick={handleFileClick}
                            currentFilePath={currentFile()?.path}
                        />
                    </div>
                </Show>
            </aside>
            <main class="flex-1 min-w-54">
                <Switch>
                    <Match when={!opendFiles.length}>
                        <RecentFileList
                            recentFiles={recentFiles()}
                            onOpenFileOrFolder={handleOpenFileOrFolder}
                        />
                    </Match>
                    <Match when={opendFiles.length}>
                        <div class="size-full flex flex-col">
                            <div
                                role="tablist"
                                class="tabs tabs-box tabs-sm shadow rounded-none flex-nowrap overflow-x-auto shrink-0"
                            >
                                <For each={opendFiles}>
                                    {(item) => {
                                        return (
                                            <a
                                                role="tab"
                                                class="tab relative max-w-30 pr-8"
                                                title={item.path}
                                                classList={{
                                                    "tab-active":
                                                        currentFile()?.path ==
                                                        item.path,
                                                }}
                                                onclick={() =>
                                                    handleFileClick(item.path)
                                                }
                                            >
                                                <button
                                                    class="btn btn-xs btn-circle btn-ghost btn-primary absolute right-2"
                                                    onclick={(e) => {
                                                        e.stopPropagation();
                                                        handleCloseFile(
                                                            item.path,
                                                        );
                                                    }}
                                                >
                                                    <Icon
                                                        icon={X}
                                                        size="small"
                                                    />
                                                </button>

                                                {dirtyFiles().includes(
                                                    item.path,
                                                ) && (
                                                    <span class="absolute right-1 -top-1 text-lg text-primary">
                                                        *
                                                    </span>
                                                )}
                                                <span class="truncate">
                                                    {item.name}
                                                </span>
                                            </a>
                                        );
                                    }}
                                </For>
                            </div>
                            <div class="flex-1 min-h-0">
                                <For each={opendFiles}>
                                    {(item) => {
                                        return (
                                            <Tiptap
                                                content={item.content}
                                                onFileDirty={(isDirty) =>
                                                    handleSetFileDirty(
                                                        item.path,
                                                        isDirty,
                                                    )
                                                }
                                                onSave={(content) =>
                                                    handleSaveFile(
                                                        item.path,
                                                        content,
                                                    )
                                                }
                                                active={
                                                    currentFile()?.path ==
                                                    item.path
                                                }
                                                basePath={basePath()}
                                            />
                                        );
                                    }}
                                </For>
                            </div>
                        </div>
                    </Match>
                </Switch>
            </main>
        </div>
    );
}
