import { Header } from "./components/header/Header";
import { Tiptap } from "./components/tiptap/Tiptap";

export function App() {
    return (
        <div class="w-full h-full flex flex-col">
			<Header />
			<main class="flex-1 overflow-y-auto">
				<Tiptap />
			</main>
        </div>
    );
}
