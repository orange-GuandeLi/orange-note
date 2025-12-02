import { FileList } from "./FileList";

export function Layout() {
    return (
        <div class="size-full flex">
            <aside class="w-54 min-w-54 resize-x border-r overflow-auto border-solid border-base-200 menu">
                <FileList
                    files={[
                        {
                            name: "test",
                            isDirectory: true,
                            isFile: false,
                            isSymlink: false,
                            path: "test",
                            children: [
                                {
                                    name: "test.md",
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
                                    ]
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
            </aside>
            <main class="flex-1 min-w-54"></main>
        </div>
    );
}
