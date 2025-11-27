import { createSignal, Show } from "solid-js";
import { Header } from "./components/header/Header";
import { NoFile, OpenFile } from "./components/no-file/NoFile";
import { Tiptap } from "./components/tiptap/Tiptap";
import { Toaster } from 'solid-toast';

export function App() {
    const [selectedFile, setSelectedFile] = createSignal<OpenFile>();

    return (
        <div class="w-full h-full">
            <div class="drawer lg:drawer-open h-full">
                <input id="NavDraw" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content flex flex-col">
                    <Header />
                    <main class="flex-1 overflow-y-auto">
                        <div class="h-full w-full" classList={{
                            "flex justify-center items-center": !selectedFile()
                        }}>
                            <Show when={selectedFile()} fallback={<NoFile onOpenFile={setSelectedFile} />}>
                                <div class="tabs tabs-box h-full rounded-none">
                                    <input type="radio" name="files" class="tab" aria-label={selectedFile()?.name || ""} checked={selectedFile()?.name === selectedFile()?.name} />
                                    <div class="tab-content bg-base-100 border-base-300">
                                        <Tiptap content={selectedFile()?.content || ""} />
                                    </div>

                                    {/* <input type="radio" name="files" class="tab" aria-label="Tab 2" />
                                    <div class="tab-content bg-base-100 border-base-300 p-6">Tab content 2</div>

                                    <input type="radio" name="files" class="tab" aria-label="Tab 3" />
                                    <div class="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div> */}
                                </div>
                            </Show>
                        </div>
                    </main>
                </div>
                <div class="drawer-side">
                    <label
                        for="NavDraw"
                        aria-label="close sidebar"
                        class="drawer-overlay"
                    ></label>
                    <ul class="menu min-h-full w-54 p-4 bg-base-200 border-r border-base-100">
                        <Show when={selectedFile()} fallback={<NoFile onOpenFile={setSelectedFile} />}>
                            <li class="active">
                                <a>{selectedFile()?.name || ""}</a>
                            </li>
                        </Show>
                        {/* Sidebar content here */}
                        {/* <li>
                            <a>Sidebar Item 1</a>
                        </li>
                        <li>
                            <a>Sidebar Item 2</a>
                        </li> */}
                    </ul>
                </div>
            </div>

            <Toaster />
        </div>
    );
}
