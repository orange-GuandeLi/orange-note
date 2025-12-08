// SolidNodeView.tsx

import { render } from "solid-js/web";
import { NodeView } from "prosemirror-view";
import { Component, mergeProps } from "solid-js";
import { NodeViewRendererProps } from "@tiptap/core";
import { EditorView } from "prosemirror-view";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { createStore, SetStoreFunction } from "solid-js/store";

export type SolidNodeViewRendererProps = NodeViewRendererProps & {
    contentRef: (el: HTMLElement) => void;
} & { updateAttributes: (attrs: Record<string, any>) => void };

// 这里的 any/any[] 是为了兼容 ProseMirror-view 内部的类型
export class SolidNodeView implements NodeView {
    public dom: HTMLElement;
    public contentDOM?: HTMLElement;
    public dispose: () => void; // SolidJS render 返回的清理函数

    // 我们需要保存这些引用以供 updateAttributes 使用
    private node: ProseMirrorNode;
    private view: EditorView;
    private getPos: () => number | undefined;
    private setState: SetStoreFunction<NodeViewRendererProps>;

    constructor(
        component: Component<SolidNodeViewRendererProps>,
        props: NodeViewRendererProps,
    ) {
        this.node = props.node;
        this.view = props.view;
        this.getPos = props.getPos;
        const [state, setState] = createStore(props);
        this.setState = setState;

        this.dom = document.createElement("div");
        const contentRef = (element: HTMLElement) => {
            // 当 Solid 组件渲染时，这个函数会被调用，将 <code> 元素赋值给 this.contentDOM
            this.contentDOM = element;
        };

        const updateAttributes = (attributes: Record<string, any>) => {
            if (typeof this.getPos === "function") {
                const pos = this.getPos();
                if (pos === undefined) return;

                // 创建一个事务：设置当前位置节点的标记（属性）
                const tr = this.view.state.tr.setNodeMarkup(
                    pos,
                    undefined, // 保持节点类型不变
                    {
                        ...this.node.attrs, // 合并旧属性
                        ...attributes, // 覆盖新属性
                    },
                );

                // 派发事务
                this.view.dispatch(tr);
            }
        };

        this.dispose = render(
            () =>
                component(mergeProps(state, { contentRef, updateAttributes })),
            this.dom,
        );
    }

    update(node: ProseMirrorNode): boolean {
        // 当节点更新时，必须同步更新 this.node，否则下次 updateAttributes 会使用旧属性
        if (node.type !== this.node.type) return false;
        this.node = node;

        this.setState("node", node);
        return true;
    }

    // 销毁方法：在节点被移除时被调用，用于清理 Solid 组件
    destroy(): void {
        this.dispose(); // 调用 Solid 的清理函数
        this.dom.remove();
    }
}
