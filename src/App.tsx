import { createSignal, For, onMount, Show } from "solid-js";
import { Header } from "./components/header/Header";
import { NoFile } from "./components/no-file/NoFile";
import { Tiptap } from "./components/tiptap/Tiptap";
import toast, { Toaster } from "solid-toast";
import { writeFile } from "@tauri-apps/plugin-fs";
import { Icon } from "./components/icon";
import { File, FilePlusCorner, FolderOpenDot, FolderPlus, Settings, X } from "lucide-solid";
import { getFileContent, OpenFile, readFile, readFolder, RecursiveDirEntry } from "./functions";
import { HomeHero } from "./components/HomeHero";
import { FileList } from "./components/FileList";

export function App() {
    const [currentOpenedFile, setCurrentOpenedFile] = createSignal<Omit<OpenFile, "content">>();
    const [openedFiles, setOpenedFiles] = createSignal<OpenFile[]>([]);
    const [selectedFiles, setSelectedFiles] = createSignal<RecursiveDirEntry[]>([]);
    let drawLabelRef: HTMLLabelElement | undefined;

    onMount(() => {
        try {
            const opendFilePath = localStorage.getItem("opendFilePath");
            if (opendFilePath) {
                if (opendFilePath) {
                    getFileContent(opendFilePath).then((opendFile) => {
                        if (opendFile) {
                            handleFileOpen(opendFile);
                        }
                    });
                }
            }
        } catch (error) {
            localStorage.removeItem("opendFilePath");
            console.error("Failed to load currentOpenedFile from localStorage", error);
        }
    });

    const handleSave = async (content: string) => {
        try {
            await writeFile(
                currentOpenedFile()?.path || "",
                new TextEncoder().encode(content),
            );
            toast.success(`Successfully saved ${currentOpenedFile()?.name || ""}`);
            return true;
        } catch (error) {
            toast.error(`Failed to save ${currentOpenedFile()?.name || ""}`);
            console.error(
                `Failed to save ${currentOpenedFile()?.name || ""}`,
                error,
            );
            return false;
        }
    };

    const handleFileOpen = (file: OpenFile) => {
        // 设置已选文件
        setSelectedFiles([{
            path: file.path,
            name: file.name,
            isDirectory: false,
            isFile: true,
            isSymlink: false,
        }]);
        localStorage.setItem("opendFilePath", file.path);
        // 添加到已打开文件列表
        setOpenedFiles([file]);
        // 设置当前打开文件
        setCurrentOpenedFile(file);
    }

    const handleFolderOpen = (files: RecursiveDirEntry[]) => {
        setSelectedFiles(files);
    }

    const handleFileClick = async (filePath: string) => {
        if (currentOpenedFile()?.path === filePath) {
            return;
        }

        if (drawLabelRef) {
            drawLabelRef.click();
        }

        const openedFile = openedFiles().find((item) => item.path === filePath);
        const fileContent = await getFileContent(filePath);
        if (!fileContent) {
            return;
        }
        if (openedFile) {
            // 更新已打开文件的内容
            openedFile.content = fileContent.content;
            // 设置当前打开文件
            setCurrentOpenedFile(openedFile);
        } else {
            // 加到列表
            setOpenedFiles((prev) => (
                [...prev, {
                    path: fileContent.path,
                    name: fileContent.name,
                    content: fileContent.content,
                }]
            ));
            // 设置当前打开文件
            setCurrentOpenedFile({
                path: fileContent.path,
                name: fileContent.name,
                content: fileContent.content,
            });
        }
    }

    const handleCloseFile = (filePath: string) => {
        setOpenedFiles((prev) => prev.filter((item) => item.path !== filePath));
        setCurrentOpenedFile((prev) => prev?.path === filePath ? undefined : prev);
    }

    return (
        <div class="size-full">
            <div class="drawer lg:drawer-open h-full">
                <input id="NavDraw" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content flex flex-col flex-1 min-h-0">
                    <Header />
                    <main class="flex-1 overflow-y-auto">
                        <div
                            class="h-full w-full"
                            classList={{
                                "flex justify-center items-center":
                                    !currentOpenedFile(),
                            }}
                        >
                            <Show
                                when={currentOpenedFile()}
                                fallback={
                                    <HomeHero />
                                }
                            >
                                <div class="flex flex-col size-full">
                                    <div role="tablist" class="tabs tabs-box rounded-none overflow-x-auto flex-nowrap">
                                        <For each={openedFiles()}>
                                            {(item) => {
                                                const hasDuplicateName = () => openedFiles().filter((file) => file.name === item.name).length > 1;
                                                return (
                                                    <a role="tab" class="tab w-auto h-auto px-4 py-2 pr-2 text-sm group max-w-36 flex" classList={{
                                                        "tab-active": item.path === currentOpenedFile()?.path
                                                    }} title={item.path} onclick={() => handleFileClick(item.path)}>
                                                        <span class="flex-1 min-w-0 truncate">{item.name}{hasDuplicateName() ? `(${item.path})` : ""}</span>
                                                        <button class="btn btn-ghost btn-primary btn-square btn-xs ml-2 shrink-0" onclick={(e) => {
                                                            e.stopPropagation();
                                                            handleCloseFile(item.path);
                                                        }}>
                                                            <Icon icon={X} size="small" />
                                                        </button>
                                                    </a>
                                                )
                                            }}
                                        </For>
                                    </div>
                                    <div class="flex-1 min-h-0 overflow-y-auto">
                                        <For each={openedFiles()}>
                                            {(item) => (
                                                <Tiptap
                                                    content={item.content || ""}
                                                    onSave={handleSave}
                                                    active={item.path === currentOpenedFile()?.path}
                                                />
                                            )}
                                        </For>
                                    </div>
                                </div>
                            </Show>
                        </div>
                    </main>
                </div>
                <div class="drawer-side overflow-visible">
                    <label
                        for="NavDraw"
                        aria-label="close sidebar"
                        class="drawer-overlay"
                        ref={drawLabelRef}
                    ></label>
                    <div class="menu min-h-full w-54 bg-base-200 p-0">
                        <div class="flex justify-between items-center bg-base-100 shadow h-16 p-2 border-r border-base-200">
                            <h2 class="font-bold text-primary">
                                OrangeNote
                            </h2>
                            <div class="flex gap-1 items-center">
                                <button
                                    class="btn btn-primary btn-soft btn-square btn-xs tooltip tooltip-primary tooltip-bottom"
                                    data-tip="Open a file"
                                    onclick={async () => {
                                        const content = await readFile();
                                        if (content) {
                                            if (drawLabelRef) {
                                                drawLabelRef.click();
                                            }
                                            handleFileOpen(content);
                                        }
                                    }}
                                >
                                    <Icon icon={File} size="small" />
                                </button>
                                <button
                                    class="btn btn-primary btn-soft btn-square btn-xs tooltip tooltip-primary tooltip-bottom"
                                    data-tip="Open a folder"
                                    onclick={async () => {
                                        const content = await readFolder();
                                        if (content) {
                                            handleFolderOpen(content);
                                        }
                                    }}
                                >
                                    <Icon icon={FolderOpenDot} size="small" />
                                </button>
                                <button
                                    class="btn btn-primary btn-soft btn-square btn-xs tooltip tooltip-primary tooltip-bottom"
                                    data-tip="Create a new file"
                                >
                                    <Icon icon={FilePlusCorner} size="small" />
                                </button>
                                <button
                                    class="btn btn-primary btn-soft btn-square btn-xs tooltip tooltip-primary tooltip-bottom"
                                    data-tip="Create a new folder"
                                >
                                    <Icon icon={FolderPlus} size="small" />
                                </button>
                            </div>
                        </div>
                        <div class="flex-1 overflow-auto min-h-0 border-base-100 border-r">
                            <Show
                                when={currentOpenedFile() || selectedFiles().length}
                                fallback={
                                    <div class="p-4">
                                        <NoFile onOpenFile={(file) => {
                                            if (drawLabelRef) {
                                                drawLabelRef.click();
                                            }
                                            handleFileOpen(file);
                                        }} onOpenFolder={handleFolderOpen} />
                                    </div>
                                }
                            >
                                <div class="tree p-2">
                                    <FileList files={selectedFiles()} onFileClick={handleFileClick} currentFile={currentOpenedFile} />
                                </div>
                            </Show>
                        </div>
                        <div class="flex-none p-4 flex justify-end border-base-100 border-r">
                            <button class="btn btn-xs btn-square">
                                <Icon icon={Settings} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Toaster />
        </div>
    );
}