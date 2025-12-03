import { FilePlus, FolderPlus, RotateCcw } from "lucide-solid";
import { FileList } from "./FileList";
import { Icon } from "./Icon";
import { RecentFileList } from "./RecentFileList";
import { NoFile } from "./NoFile";

export function Layout() {
    return (
        <div class="size-full flex">
            <aside class="w-54 min-w-54 resize-x border-r overflow-x-auto border-solid border-base-200 flex flex-col">
                {/* <div class="h-10 shadow shrink-0 flex items-center p-2 text-sm justify-between">
                    <span class="truncate min-w-0" title="folder name name name name name">folder name name name name name</span>
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
                </div> */}
                {/* <div class="menu flex-1 min-h-0 overflow-y-auto">
                    <FileList
                        files={[
                            {
                                name: "testtesttesttesttesttesttesttesttesttest",
                                isDirectory: true,
                                isFile: false,
                                isSymlink: false,
                                path: "test",
                                children: [
                                    {
                                        name: "testtesttesttesttesttesttesttesttesttest.md",
                                        isDirectory: false,
                                        isFile: true,
                                        isSymlink: false,
                                        path: "test.md",
                                    },
                                    // 再来个文件夹，里面是文件
                                    {
                                        name: "test2",
                                        isDirectory: true,
                                        isFile: false,
                                        isSymlink: false,
                                        path: "test2",
                                        children: [
                                            {
                                                name: "test2.md",
                                                isDirectory: false,
                                                isFile: true,
                                                isSymlink: false,
                                                path: "test2.md",
                                            },
                                        ],
                                    },
                                ],
                            },
                             // 补数据
                            {
                                name: "test2",
                                isDirectory: true,
                                isFile: false,
                                isSymlink: false,
                                path: "test2",
                                children: [
                                    {
                                        name: "test2.md",
                                        isDirectory: false,
                                        isFile: true,
                                        isSymlink: false,
                                        path: "test2.md",
                                    },
                                ],
                            },
                            // 来个文件
                            {
                                name: "test3.md",
                                isDirectory: false,
                                isFile: true,
                                isSymlink: false,
                                path: "test3.md",
                            },
                        ]}
                        onFileClick={() => {}}
                    />
                </div> */}
                <div class="p-4 mt-4">
                    <NoFile onOpenFolder={() => {}} />
                </div>
            </aside>
            <main class="flex-1 min-w-54">
                <RecentFileList recentFiles={[
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
                ]} />
            </main>
        </div>
    );
}
