// import { Extension } from "@tiptap/core";
// import { Plugin } from "@tiptap/pm/state";

// export const PasteMarkdown = Extension.create({
//     name: "pasteMarkdown",

//     addProseMirrorPlugins(this) {
//         const { editor } = this;
//         return [
//             new Plugin({
//                 props: {
//                     handlePaste(_, event) {
//                         const text = event.clipboardData?.getData("text/plain");

//                         if (!text) {
//                             return false;
//                         }

//                         // Pre-process the text to fix non-standard task lists
//                         const lines = text.split("\n");
//                         const processedLines = lines.map((line) => {
//                             // If a line looks like a task item but is missing the list marker, add it.
//                             // This also preserves indentation for nested lists.
//                             if (
//                                 /^\s*\[[x ]\]\s/.test(line) &&
//                                 !/^\s*[-*+]\s/.test(line)
//                             ) {
//                                 const indentation =
//                                     line.match(/^\s*/)?.[0] || "";
//                                 const content = line.slice(indentation.length);
//                                 return `${indentation}- ${content}`;
//                             }
//                             return line;
//                         });
//                         const processedText = processedLines.join("\n");

//                         // Check if text looks like Markdown
//                         if (
//                             looksLikeMarkdown(processedText) &&
//                             editor.markdown
//                         ) {
//                             // Parse the Markdown text to Tiptap JSON using the Markdown manager
//                             const json = editor.markdown.parse(processedText);

//                             // Insert the parsed JSON content at cursor position
//                             editor.commands.insertContent(json);
//                             return true;
//                         }

//                         return false;
//                     },
//                 },
//             }),
//         ];
//     },
// });

// /**
//  * A more robust heuristic to determine if the pasted text is likely Markdown.
//  * @param text The text to check.
//  * @returns True if the text looks like Markdown, false otherwise.
//  */
// function looksLikeMarkdown(text: string): boolean {
//     const mdRegex = [
//         /^#{1,6}\s/m, // Headings
//         /(\*\*|__)(?=\S)([^\r]*?\S)\1/, // Bold
//         /(\*|_)(?=\S)([^\r]*?\S)\1/, // Italic
//         /~~(?=\S)([^\r]*?\S)~~/, // Strikethrough
//         /`(.+?)`/, // Inline code
//         /\[(.+?)\]\((.+?)\)/, // Links
//         /^\s*([-*+])\s/m, // Unordered lists
//         /^\s*([0-9]+)\.\s/m, // Ordered lists
//         /^\s*>\s/m, // Blockquotes
//         /^\s*```/m, // Code blocks
//         /^\s*\|(.+)\|/m, // Tables
//         // After pre-processing, we look for the standard GFM task list format.
//         /^\s*-\s\[[x ]\]\s/m,
//     ];

//     // Also check for multiple newlines, which is common in Markdown documents
//     // but less common in single lines of text.
//     if (/\n{2,}/.test(text)) {
//         return true;
//     }

//     // Check if any of the regex patterns match.
//     return mdRegex.some((regex) => regex.test(text));
// }
