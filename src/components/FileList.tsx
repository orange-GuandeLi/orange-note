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
        <ul>
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
                                    onclick={() => props.onFileClick(item.path)}
                                >
                                    <Icon icon={FileBraces} /> {item.name}
                                </button>
                            </li>
                        );
                    } else {
                        return (
                            <li title={item.path}>
                                <details>
                                    <summary>
                                        <Icon icon={Folder}/>
                                        {item.name}
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
