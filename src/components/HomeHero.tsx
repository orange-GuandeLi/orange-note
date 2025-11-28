import { OpenFile, readFileOrFolder } from "../functions";

type Props = {
    onFileOpen: (file: OpenFile) => void
}

export function HomeHero(props: Props) {
    return (
        <div class="hero bg-base-200 h-full">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">
                        Hello there
                    </h1>
                    <div class="py-6">
                        <p>Welcome to <a href="https://github.com/orange-GuandeLi/orange-note" title="Orange-note" class="text-secondary hover:underline">Orange-note</a></p>
                        <p class="my-2 text-xs">It's a software focused solely on Markdown writing, providing a WYSIWYG Markdown writing experience</p>
                        <p class="text-xs">Thanks to <a href="https://v2.tauri.app/" title="Tauri" class="text-secondary hover:underline">Tauri</a> and <a href="https://tiptap.dev/" title="Tiptap" class="text-secondary hover:underline">Tiptap</a>.</p>
                    </div>
                    <button class="btn btn-primary btn-dash mt-4" onclick={() => readFileOrFolder(props.onFileOpen)}>
                        Open File or Folder
                    </button>
                </div>
            </div>
        </div>
    )
}