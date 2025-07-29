import makeEventListener from "@/utils/makeEventListener.ts";
import {CSSProperties, MouseEventHandler} from "react";

export interface ICornMakeDraggableOptions {
    onPosChange?: (x: number, y: number) => void;
    onStyleChange: (style: CSSProperties) => void;
}

/**
 * 如果子元素不想被拖动
 *
 * 请使用 addEventListener 阻止子元素, mousedown 冒泡
 *
 * innerRef.current.addEventListener("mousedown", event => {
 *     event.stopPropagation();
 * })
 *
 * 如果子元素不需要 cursor 为 grab 的样式, 请直接用 cursor-default 覆盖
 *
 */
export function corn_makeDraggable(options: ICornMakeDraggableOptions) {
    const {
        onPosChange: paramPosChangeFn,
        onStyleChange: paramStyleChangeFn,
    } = options;

    let originX = 0;
    let originY = 0;
    let isDragging = false;
    let startX: number, startY: number;

    paramStyleChangeFn?.({
        cursor: "grab"
    })

    const onMouseDown: MouseEventHandler = (event) => {
        // event.stopPropagation();
        // event.preventDefault();

        isDragging = true;

        startX = event.clientX;
        startY = event.clientY;

        paramStyleChangeFn?.({
            cursor: "grabbing",
            animationDuration: "0s", // 避免目标元素设置了 animationDuration, 导致拖动不顺畅
        })
    }

    const onMouseUp: MouseEventHandler = (event) => {
        // event.stopPropagation();
        // event.preventDefault();
        isDragging = false;

        paramStyleChangeFn?.({
            cursor: "grab",
            animationDuration: "",
        })
    }

    const onMouseMove: MouseEventHandler = (event) => {
        // event.stopPropagation();
        // event.preventDefault();
        if (!isDragging) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        originX += dx;
        originY += dy;

        startX = event.clientX;
        startY = event.clientY;

        paramPosChangeFn?.(originX, originY);
    }

    function reset() {
        originX = 0;
        originY = 0;

        paramPosChangeFn?.(originX, originY);
    }

    function setTranslate(x: number, y: number) {
        paramStyleChangeFn?.({
            translate: `${x}px ${y}px`,
        });
    }

    return {
        reset,
        setPos(x: number, y: number) {
            originX = x;
            originY = y;

            paramPosChangeFn?.(originX, originY);
        },
        setTranslate,
        draggableProps: {
            onMouseDown,
            onMouseUp,
            onMouseMove,
        }
    };
}
