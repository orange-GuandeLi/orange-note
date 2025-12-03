import { FilePlus, FolderPlus, RotateCcw } from "lucide-solid";
import { FileList } from "./FileList";
import { Icon } from "./Icon";
import { RecentFileList } from "./RecentFileList";
import { NoFile } from "./NoFile";
import { createSignal, Show } from "solid-js";
import { readFolder, RecursiveDirEntry } from "../functions";
import toast from "solid-toast";

export function Layout() {
    const [selectedFolder, setSelectedFolder] = createSignal<
        RecursiveDirEntry | undefined
    >();

    const handleOpenFolder = async () => {
        try {
            const folder = await readFolder();
            setSelectedFolder(folder);
        } catch {
            toast.error("Failed to read folder");
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
                    recentFiles={[
                        {
                            name: "testtesttesttesttesttesttesttesttesttest.md",
                            isDirectory: false,
                            isFile: false,
                            isSymlink: false,
                            path: "/User/orange/code/note/test.md",
                        },
                        {
                            name: "testtesttesttesttesttesttesttesttesttest.md",
                            isDirectory: false,
                            isFile: true,
                            isSymlink: false,
                            path: "/User/orange/code/note/test.md",
                        },
                        {
                            name: "testtesttesttesttesttesttesttesttesttest.md",
                            isDirectory: false,
                            isFile: true,
                            isSymlink: false,
                            path: "/User/orange/code/note/test.md",
                        },
                        {
                            name: "testtesttesttesttesttesttesttesttesttest.md",
                            isDirectory: false,
                            isFile: false,
                            isSymlink: false,
                            path: "/User/orange/code/note/test.md",
                        },
                        {
                            name: "testtesttesttesttesttesttesttesttesttest.md",
                            isDirectory: false,
                            isFile: true,
                            isSymlink: false,
                            path: "/User/orange/code/note/test.md",
                        },
                    ]}
                />
            </main>
        </div>
    );
}
