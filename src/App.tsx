import { createSignal, Show } from "solid-js";
import { HomeHero } from "./components/HomeHero";
export function App() {
    const [started, setStarted] = createSignal(false);

    return (
        <div class="h-svh w-svw">
            <Show when={started()} fallback={<HomeHero />}>
                fdsaf
            </Show>
        </div>
    );
}
