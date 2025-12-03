import { For, Show } from "solid-js";
import { RecursiveDirEntry } from "../functions";
import { Icon } from "./Icon";
import { File, Folder } from "lucide-solid";

type Props = {
    recentFiles: RecursiveDirEntry[];
}

export function RecentFileList(props: Props) {
    return (
        <div class="flex size-full items-center justify-center">
            <Show when={props.recentFiles.length > 0} fallback={<p class="text-base-200 text-lg">You have no recent files</p>}>
               <div class="flex flex-col gap-1">
                    <p class="text-lg">Recent Files:</p>
                    <For each={props.recentFiles}>
                        {file => (
                            <button class="btn btn-link p-0 btn-sm">
                                <Icon icon={file.isFile ? File : Folder} />
                                <span class="truncate">{file.path}</span>
                            </button>
                        )}
                    </For>
               </div>
            </Show>
        </div>
    );
}
