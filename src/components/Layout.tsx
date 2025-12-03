import { FilePlus, FolderPlus, RotateCcw, X } from "lucide-solid";
import { FileList } from "./FileList";
import { Icon } from "./Icon";
import { RecentFileList } from "./RecentFileList";
import { NoFile } from "./NoFile";
import { createSignal, For, Match, onMount, Show, Switch } from "solid-js";
import {
    getFileContent,
    getFolderContent,
    OpenFile,
    readFolder,
    RecursiveDirEntry,
} from "../functions";
import toast from "solid-toast";
import { Tiptap } from "./tiptap/Tiptap";

export function Layout() {
    onMount(() => {
        const selectedFolder = localStorage.getItem("selectedFolder");
        if (selectedFolder) {
            try {
                getFolderContent(selectedFolder).then((folder) => {
                    setFolder(folder);
                });
            } catch {
                toast.error("Failed to read folder");
            }
        }

        try {
            const recentFilesJSON = JSON.parse(
                localStorage.getItem("recentFolders") || "[]",
            ) as RecursiveDirEntry[];
            setRecentFiles(recentFilesJSON);
        } catch {
            toast.error("Failed to read recent files");
        }
    });

    const [selectedFolder, setSelectedFolder] = createSignal<
        RecursiveDirEntry | undefined
    >();
    const [recentFiles, setRecentFiles] = createSignal<RecursiveDirEntry[]>([]);
    const [currentFile, setCurrentFile] = createSignal<OpenFile | undefined>();
    const [opendFiles, setOpendFiles] = createSignal<OpenFile[]>([]);

    const handleFileClick = (filePath: string) => {
        if (currentFile()?.path === filePath) {
            return;
        }

        // 读取文件更新content
        try {
            getFileContent(filePath).then((file) => {
                if (!opendFiles().find((item) => item.path === filePath)) {
                    setOpendFiles((prev) => [
                        ...prev,
                        {
                            ...file,
                            draft: file.content,
                        },
                    ]);
                } else {
                    setOpendFiles((prev) =>
                        prev.map((item) =>
                            item.path === filePath
                                ? {
                                      ...item,
                                      content: file.content,
                                  }
                                : item,
                        ),
                    );
                }
                setCurrentFile(opendFiles().find((item) => item.path === filePath));
            });
        } catch {
            toast.error("Failed to read file");
        }
    };

    const handleOpenFolder = () => {
        try {
            readFolder().then((folder) => {
                setFolder(folder);
            });
        } catch {
            toast.error("Failed to read folder");
        }
    };

    const setFolder = (folder: RecursiveDirEntry | undefined) => {
        if (!folder) {
            return;
        }
        setSelectedFolder(folder);
        localStorage.setItem("selectedFolder", folder.path);
        try {
            const recentFolders = JSON.parse(
                localStorage.getItem("recentFolders") || "[]",
            ) as RecursiveDirEntry[];
            // Remove duplicates
            const uniqueFolders = recentFolders.filter(
                (f) => f.path !== folder.path,
            );
            localStorage.setItem(
                "recentFolders",
                JSON.stringify([folder, ...uniqueFolders]),
            );
        } catch {
            toast.error("Failed to update recent folders");
        }
    };

    const handleOpenFileOrFolder = (file: RecursiveDirEntry) => {
        if (file.isDirectory) {
            try {
                getFolderContent(file.path).then((folder) => {
                    setFolder(folder);
                });
            } catch {
                toast.error("Failed to read folder");
            }
        }
    };

    const handleCloseFile = (filePath: string) => {
        setOpendFiles((prev) => prev.filter((item) => item.path !== filePath));

        if (currentFile()?.path === filePath) {
            setCurrentFile(opendFiles().find((item) => item.path !== filePath));
        }
    };

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
                            <button class="btn btn-square btn-xs btn-ghost">
                                <Icon icon={FilePlus} size="small" />
                            </button>
                            <button class="btn btn-square btn-xs btn-ghost">
                                <Icon icon={FolderPlus} size="small" />
                            </button>
                            <button class="btn btn-square btn-xs btn-ghost">
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
                    <Match when={!opendFiles().length}>
                        <RecentFileList
                            recentFiles={recentFiles()}
                            onOpenFileOrFolder={handleOpenFileOrFolder}
                        />
                    </Match>
                    <Match when={opendFiles().length}>
                        <div class="size-full flex flex-col">
                            <div
                                role="tablist"
                                class="tabs tabs-box tabs-sm shadow rounded-none flex-nowrap overflow-x-auto shrink-0"
                            >
                                <For each={opendFiles()}>
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
                                                        handleCloseFile(item.path);
                                                    }}
                                                >
                                                    <Icon
                                                        icon={X}
                                                        size="small"
                                                    />
                                                </button>
                                                <span class="truncate">
                                                    {item.name}
                                                </span>
                                            </a>
                                        );
                                    }}
                                </For>
                            </div>
                            <div class="flex-1 min-h-0">
                                <For each={opendFiles()}>
                                    {(item) => {
                                        return (
                                            <Tiptap
                                                content={item.draft || ""}
                                                onSave={() => {}}
                                                active={
                                                    currentFile()?.path ==
                                                    item.path
                                                }
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
