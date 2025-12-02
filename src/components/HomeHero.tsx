export function HomeHero() {
    return (
        <div class="hero bg-base-200 h-full">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">
                        <span class="mr-2">Hello</span>
                        <span class="text-rotate">
                            <span class="justify-items-center">
                                <span>DEVELOPER</span>
                                <span>MARKDOWN</span>
                            </span>
                        </span>
                    </h1>
                    <div class="py-6">
                        <p>
                            Welcome to{" "}
                            <a
                                href="https://github.com/orange-GuandeLi/orange-note"
                                title="Orange-note"
                                class="text-secondary hover:underline"
                            >
                                Orange-note
                            </a>
                        </p>
                        <p class="my-2 text-xs">
                            It's a software focused solely on Markdown writing,
                            providing a WYSIWYG Markdown writing experience
                        </p>
                        <p class="text-xs">
                            Thanks to{" "}
                            <a
                                href="https://v2.tauri.app/"
                                title="Tauri"
                                class="text-secondary hover:underline"
                            >
                                Tauri
                            </a>{" "}
                            and{" "}
                            <a
                                href="https://tiptap.dev/"
                                title="Tiptap"
                                class="text-secondary hover:underline"
                            >
                                Tiptap
                            </a>
                            .
                        </p>
                    </div>
                    <label for="NavDraw" class="btn btn-primary drawer-button">
                        Get Started
                    </label>
                </div>
            </div>
        </div>
    );
}
