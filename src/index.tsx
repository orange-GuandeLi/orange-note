import "./assets/tiptap.css";
/* @refresh reload */
import { render } from "solid-js/web";
import { App } from "./App";
import { Toaster } from "solid-toast";

render(
    () => (
        <>
            <App />
            <Toaster />
        </>
    ),
    document.getElementById("root") as HTMLElement,
);
