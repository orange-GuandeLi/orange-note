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
                // open folder
                getFolderContent(selectedFolder).then((folder) => {
                    setFolderData(folder);
                });

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
                setOpendFilesData(opendFilesJSON);

                // set current file
                if (opendFilesOrderJSON.length > 0) {
                    handleFileClick(opendFilesOrderJSON[opendFilesOrderJSON.length - 1]);
                }
            } catch {
                toast.error("Faild to read folder or recent files or opend files order");
            }
        }
    });

    const [selectedFolder, setSelectedFolder] = createSignal<
        RecursiveDirEntry | undefined
    >();
    const [recentFiles, setRecentFiles] = createSignal<RecursiveDirEntry[]>([]);
    const [currentFile, setCurrentFile] = createSignal<OpenFile | undefined>();
    const [opendFiles, setOpendFiles] = createSignal<OpenFile[]>([]);
    let opendFilesOrder: string[] = [];

    const setOpendFilesOrderData = (order: string[]) => {
        opendFilesOrder = order;
        localStorage.setItem("opendFilesOrder", JSON.stringify(opendFilesOrder));
    };

    const setOpendFilesData = (files: OpenFile[]) => {
        setOpendFiles(files);
        localStorage.setItem("opendFiles", JSON.stringify(files.map((item) => ({
            ...item,
            draft: "",
            content: "",
            isOpend: false,
        }))));
    };

    const handleFileClick = (filePath: string) => {
        if (currentFile()?.path === filePath) {
            return;
        }

        // 记录一个文件打开顺序栈
        setOpendFilesOrderData([...opendFilesOrder, filePath]);

        // 读取文件更新content
        try {
            getFileContent(filePath).then((file) => {
                if (!opendFiles().find((item) => item.path === filePath)) {
                    setOpendFilesData([
                        ...opendFiles(),
                        {
                            ...file,
                            draft: file.content,
                            isOpend: true,
                        },
                    ]);
                } else {
                    setOpendFilesData(opendFiles().map((item) =>
                        item.path === filePath
                            ? {
                                ...item,
                                content: file.content,
                                draft: item.isOpend ? item.draft : file.content,
                              }
                            : item,
                    ));
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
                setFolderData(folder);
            });
        } catch {
            toast.error("Failed to read folder");
        }
    };

    const setFolderData = (folder: RecursiveDirEntry | undefined) => {
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
                    setFolderData(folder);
                });
            } catch {
                toast.error("Failed to read folder");
            }
        }
    };

    const handleCloseFile = (filePath: string) => {
        setOpendFilesData(opendFiles().filter((item) => item.path !== filePath));

        // 记录一个文件关闭顺序栈
        setOpendFilesOrderData(opendFilesOrder.filter((item) => item !== filePath));
        // 关闭文件后，设置当前文件为最近打开的文件，
        // 如果最近打开的文件被关闭了，就找倒数第二个最近打开的文件
        if (currentFile()?.path === filePath) {
            setCurrentFile(
                opendFiles().find(
                    (item) =>
                        item.path === opendFilesOrder[opendFilesOrder.length - 1] ||
                        item.path === opendFilesOrder[opendFilesOrder.length - 2],
                ),
            );
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
