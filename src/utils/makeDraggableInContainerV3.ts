import {
    corn_makeDraggable as makeDraggable
} from "@/utils/makeDraggableV3.ts";
import {throttle} from "lodash";
import {CSSProperties} from "react";

export interface ICornMakeDraggableInContainerProps {
    gapX?: number,
    gapY?: number,
    throttleWait?: number,
    containerEl?: HTMLElement,
    initCallback?: (readonly_options: {minX: number, maxX: number, minY: number, maxY: number}) => void,

    // corn_makeDraggable 的参数
    onStyleChange: (style: CSSProperties) => void,
}

// 拖拽通过 translate 实现, 如果 targetEl 本身有 translate, 请将代码放到 transform, 让二者叠加就 ok
// 术语定义:
// draggable 可以被拖动的元素, 如对话框的边框部分, 通常是整个对话框
// inner: 内部元素, 通常是不可以被拖动的地方, 如对话框的内部
// container: 包含对话框的元素, 通常是 document.body
export function corn_makeDraggableInContainer(
    draggableEl: HTMLElement,
    options: ICornMakeDraggableInContainerProps
) {
    let {
        gapX: optionGapX = 0,
        gapY: optionGapY = 0,
        throttleWait: optionThrottleWait = 1000,
        containerEl: optionContainerEl = document.body,
        initCallback: optionInitCallback = () => {},
        onStyleChange: optionStyleChangeFn,
   } = options;

    let minX: number = 0;
    let maxX: number = 0;
    let minY: number = 0;
    let maxY: number = 0;

    let originRect = draggableEl.getBoundingClientRect();

    function calcLimit() {
        let targetWidth = draggableEl.offsetWidth;
        let targetHeight = draggableEl.offsetHeight;

        // 获取父元素边界
        const rect = optionContainerEl.getBoundingClientRect();

        minX = rect.left + optionGapX; // 左边界
        maxX = rect.right - targetWidth - optionGapX; // 右边界

        const diffX = originRect.x - rect.x;
        minX -= diffX;
        maxX -= diffX;

        minY = rect.top + optionGapY; // 上边界
        maxY = rect.bottom - targetHeight - optionGapY; // 下边界

        const diffY = originRect.y - rect.y;
        minY -= diffY;
        maxY -= diffY;
    }

    const calcLimitThrottle = throttle(calcLimit, optionThrottleWait);

    // 上一次使用的 x
    let lastX = 0;
    let lastY = 0;

    // 处理父容器大小变动的边界情况
    function calcOrigin() {
        const rect = draggableEl.getBoundingClientRect();

        originRect = {
            ...originRect,
            x: rect.x - lastX,
            y: rect.y - lastY,
        }
    };

    // 创建观察器实例
    const resizeObserver = new ResizeObserver(() => {
        calcOrigin();

        calcLimit();

        const {x, y} = setTranslate(lastX, lastY)

        result.setPos(x, y);
    });

    // 开始监听目标元素
    resizeObserver.observe(draggableEl);
    resizeObserver.observe(optionContainerEl);

    calcLimitThrottle();

    optionInitCallback({
        minX,
        maxX,
        minY,
        maxY,
    });

    function setTranslate(x: number, y: number) {
        // 限制 x 和 y 在父元素范围内
        const restrictedX = Math.max(minX, Math.min(maxX, x));
        const restrictedY = Math.max(minY, Math.min(maxY, y));

        lastX = restrictedX;
        lastY = restrictedY;

        result.setTranslate(restrictedX, restrictedY);

        return {
            x: lastX,
            y: lastY,
        }
    }

    const result = makeDraggable({
        onPosChange(x, y){
            calcLimitThrottle();

            setTranslate(x, y);
        },
        onStyleChange: optionStyleChangeFn
    });

    return {
        ...result,
        cancel() {
            resizeObserver.unobserve(draggableEl);
            resizeObserver.unobserve(optionContainerEl);
        }
    }
}
