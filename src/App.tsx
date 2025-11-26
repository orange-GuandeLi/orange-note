import { Header } from "./components/Header";
import { Tiptap } from "./components/Tiptap";

export function App() {
    return (
        <>
            <div class="col-span-12">
                <Header />
            </div>
            <main class="col-span-12">
                <Tiptap />
            </main>
        </>
    );
}
