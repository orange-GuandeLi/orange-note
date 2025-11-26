import "./assets/tiptap.css";
/* @refresh reload */
import { render } from "solid-js/web";
import { App } from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
