import { createSignal, Show } from "solid-js";
import { Header } from "./components/header/Header";
import { NoFile } from "./components/no-file/NoFile";
import { Tiptap } from "./components/tiptap/Tiptap";
import toast, { Toaster } from "solid-toast";
import { writeFile } from "@tauri-apps/plugin-fs";
import { Icon } from "./components/icon";
import { FilePlusCorner, FolderOpenDot, FolderPlus, Settings, X } from "lucide-solid";
import { OpenFile, readFileOrFolder } from "./functions";
import { HomeHero } from "./components/HomeHero";

export function App() {
    const [selectedFile, setSelectedFile] = createSignal<OpenFile>();
    let drawLabelRef: HTMLLabelElement | undefined;

    const handleSave = async (content: string) => {
        try {
            await writeFile(
                selectedFile()?.path || "",
                new TextEncoder().encode(content),
            );
            toast.success(`Successfully saved ${selectedFile()?.name || ""}`);
            return true;
        } catch (error) {
            toast.error(`Failed to save ${selectedFile()?.name || ""}`);
            console.error(
                `Failed to save ${selectedFile()?.name || ""}`,
                error,
            );
            return false;
        }
    };

    const handleFileOpen = (file: OpenFile) => {
        if (drawLabelRef) {
            drawLabelRef.click();
        }
        setSelectedFile(file);
    }

    return (
        <div class="size-full">
            <div class="drawer lg:drawer-open h-full">
                <input id="NavDraw" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content flex flex-col">
                    <Header />
                    <main class="flex-1 overflow-y-auto">
                        <div
                            class="h-full w-full"
                            classList={{
                                "flex justify-center items-center":
                                    !selectedFile(),
                            }}
                        >
                            <Show
                                when={selectedFile()}
                                fallback={
                                    <HomeHero onFileOpen={handleFileOpen} />
                                }
                            >
                                <div class="flex flex-col size-full">
                                    <div role="tablist" class="tabs tabs-box rounded-none">
                                        <a role="tab" class="tab w-auto h-auto px-4 py-2 pr-2 text-sm group" classList={{
                                            "tab-active": true
                                        }}>
                                            <span>{selectedFile()?.name}</span>
                                            <button class="btn btn-ghost btn-primary btn-square btn-xs ml-2">
                                                <Icon icon={X} size="small" />
                                            </button>
                                        </a>
                                    </div>
                                    <div class="flex-1 min-h-0">
                                        <Tiptap
                                            content={
                                                selectedFile()?.content || ""
                                            }
                                            onSave={handleSave}
                                        />
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
                            <h2 class="text-lg font-bold text-primary">
                                Orange Note
                            </h2>
                            <div class="flex gap-1 items-center">
                                <button
                                    class="btn btn-primary btn-soft btn-square btn-xs tooltip tooltip-primary tooltip-bottom"
                                    data-tip="Open a file or folder"
                                    onclick={() => readFileOrFolder(handleFileOpen)}
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
                                when={selectedFile()}
                                fallback={
                                    <div class="p-4">
                                        <NoFile onOpenFile={handleFileOpen} />
                                    </div>
                                }
                            >
                                <ul class="p-2">
                                    <li class="text-sm">
                                        <a>{selectedFile()?.name || ""}</a>
                                    </li>
                                </ul>
                            </Show>
                        </div>
                        {/* Sidebar content here */}
                        {/* <li>
                            <a>Sidebar Item 1</a>
                        </li>
                        <li>
                            <a>Sidebar Item 2</a>
                        </li> */}
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
