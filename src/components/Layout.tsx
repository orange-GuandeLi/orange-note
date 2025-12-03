import { FilePlus, FolderPlus, RotateCcw } from "lucide-solid";
import { FileList } from "./FileList";
import { Icon } from "./Icon";
import { RecentFileList } from "./RecentFileList";
import { NoFile } from "./NoFile";
import { createSignal, onMount, Show } from "solid-js";
import { getFolderContent, readFolder, RecursiveDirEntry } from "../functions";
import toast from "solid-toast";

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
                localStorage.getItem("recentFolders") || "[]"
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
                localStorage.getItem("recentFolders") || "[]"
            ) as RecursiveDirEntry[];
            // Remove duplicates
            const uniqueFolders = recentFolders.filter(
                (f) => f.path !== folder.path
            );
            localStorage.setItem(
                "recentFolders",
                JSON.stringify([folder, ...uniqueFolders])
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

    return (
        <div class="size-full flex">
            <aside class="w-54 min-w-54 resize-x overflow-x-auto shadow flex flex-col">
                <Show
                    when={selectedFolder()}
                    fallback={<div class="p-4"><NoFile onOpenFolder={handleOpenFolder} /></div>}
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
                            onFileClick={() => {}}
                        />
                    </div>
                </Show>
            </aside>
            <main class="flex-1 min-w-54">
                <RecentFileList
                    recentFiles={recentFiles()}
                    onOpenFileOrFolder={handleOpenFileOrFolder}
                />
            </main>
        </div>
    );
}
