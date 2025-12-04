import { createSignal, Show } from "solid-js";
import { HomeHero } from "./components/HomeHero";
import { Layout } from "./components/Layout";
import "./app.css";

const STARTED_KEY = "started";

export function App() {
    const [started, setStarted] = createSignal(
        localStorage.getItem(STARTED_KEY) === "true",
    );
    const onStart = () => {
        localStorage.setItem(STARTED_KEY, "true");
        setStarted(true);
    };

    return (
        <div class="h-svh w-svw">
            <Show when={started()} fallback={<HomeHero onStart={onStart} />}>
                <Layout />
            </Show>
        </div>
    );
}
