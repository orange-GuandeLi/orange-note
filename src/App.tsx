import { createSignal, Show } from "solid-js";
import { Header } from "./components/header/Header";
import { NoFile } from "./components/no-file/NoFile";
import { Tiptap } from "./components/tiptap/Tiptap";
import { Toaster } from 'solid-toast';

export function App() {
    const [fileContent, setFileContent] = createSignal("");

    return (
        <div class="w-full h-full flex flex-col">
            <div class="drawer lg:drawer-open">
                <input id="NavDraw" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content">
                    <Header />
                </div>
                <div class="drawer-side">
                    <label
                        for="NavDraw"
                        aria-label="close sidebar"
                        class="drawer-overlay"
                    ></label>
                    <ul class="menu min-h-full w-54 p-4 bg-base-200">
                        <NoFile onOpenFile={setFileContent} />
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
            <main class="flex-1 overflow-y-auto">
                <div class="flex h-full justify-center items-center">
                    <Show when={fileContent()} fallback={<NoFile onOpenFile={setFileContent} />}>
                        <Tiptap content={fileContent()} />
                    </Show>
                </div>
            </main>

            <Toaster />
        </div>
    );
}
