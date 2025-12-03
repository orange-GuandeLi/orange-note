import { For } from "solid-js";
import { RecursiveDirEntry } from "../functions";
import { Icon } from "./Icon";
import { FileBraces, Folder } from "lucide-solid";

type Props = {
    files: RecursiveDirEntry[];
    onFileClick: (filePath: string) => void;
};

export function FileList(props: Props) {
    return (
        <ul class="max-w-full">
            <For each={props.files}>
                {(item) => {
                    if (item.isFile) {
                        return (
                            <li title={item.path}>
                                <button
                                    classList={
                                        {
                                            // "bg-primary text-primary-content": item.path === props.currentFile()?.path
                                        }
                                    }
                                    class="max-w-full"
                                    onclick={() => props.onFileClick(item.path)}
                                >
                                    <Icon icon={FileBraces} /> <span class="truncate">{item.name}</span>
                                </button>
                            </li>
                        );
                    } else {
                        return (
                            <li title={item.path}>
                                <details class="max-w-full">
                                    <summary>
                                        <Icon icon={Folder}/>
                                        <span class="truncate">{item.name}</span>
                                    </summary>
                                    {item.children ? (
                                        <FileList
                                            onFileClick={props.onFileClick}
                                            files={item.children}
                                        />
                                    ) : null}
                                </details>
                            </li>
                        );
                    }
                }}
            </For>
        </ul>
    );
}
