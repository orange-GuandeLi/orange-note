import { Accessor, createSignal, For } from "solid-js";
import { OpenFile, RecursiveDirEntry } from "../functions";
import { Icon } from "./icon";
import { FileBraces, Folder, FolderOpen } from "lucide-solid";

type Props = {
    files: RecursiveDirEntry[];
    onFileClick: (filePath: string) => void;
    currentFile: Accessor<Omit<OpenFile, "content"> | undefined>;
}

export function FileList(props: Props) {
    const [isOpen, setIsOpen] = createSignal(false);

    return (
        <ul>
            <For each={props.files}>
                {
                    (item) => {
                        if (item.isFile) {
                            return (
                                <li title={item.path}>
                                    <button classList={{
                                        "bg-primary text-primary-content": item.path === props.currentFile()?.path
                                    }} onclick={() => props.onFileClick(item.path)}><Icon icon={FileBraces} /> {item.name}</button>
                                </li>
                            );
                        } else {
                            return <li title={item.path}>
                                <details
                                    onToggle={(e) => setIsOpen(e.currentTarget.open)}
                                >
                                    <summary>
                                        <Icon 
                                            icon={isOpen() ? FolderOpen : Folder} 
                                        />
                                        {item.name}
                                    </summary>
                                    {
                                        item.children ? <FileList onFileClick={props.onFileClick} files={item.children} currentFile={props.currentFile} /> : null
                                    }
                                </details>
                            </li>;
                        }
                    }
                }
            </For>
        </ul>
    );
}