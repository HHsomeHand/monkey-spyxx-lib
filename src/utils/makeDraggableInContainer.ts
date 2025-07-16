import {makeDraggable, setElmTranslate} from "@/utils/makeDraggableV2.ts";
import {throttle} from "lodash";

interface MakeDraggableInContainerProps {
    gapX: number,
    gapY: number,
}

// 拖拽通过 translate 实现, 如果 targetEl 本身有 translate, 请移动到 transform, 让二者叠加就 ok
export function makeDraggableInContainer(
    targetEl: HTMLElement,
    containerEl: HTMLElement = document.body,
    initCallback?: (options: {minX: number, maxX: number, minY: number, maxY: number}) => void,
    options: MakeDraggableInContainerProps = {
        gapX: 0,
        gapY: 0,
    }
) {
    let minX: number = 0;
    let maxX: number = 0;
    let minY: number = 0;
    let maxY: number = 0;

    let originRect = targetEl.getBoundingClientRect();

    const calcLimit = throttle(() => {
        let targetWidth = targetEl.offsetWidth;
        let targetHeight = targetEl.offsetHeight;

        // 获取父元素边界
        const rect = containerEl.getBoundingClientRect();

        minX = rect.left + options.gapX; // 左边界
        maxX = rect.right - targetWidth - options.gapX; // 右边界

        const diffX = originRect.x - rect.x;
        minX -= diffX;
        maxX -= diffX;

        minY = rect.top + options.gapY; // 上边界
        maxY = rect.bottom - targetHeight - options.gapY; // 下边界

        const diffY = originRect.y - rect.y;
        minY -= diffY;
        maxY -= diffY;
    }, 1000);

    // 上一次使用的 x
    let lastX = 0;
    let lastY = 0;

    // 处理父容器大小变动的边界情况
    const calcOrigin = throttle(() => {
        const rect = targetEl.getBoundingClientRect();

        originRect = {
            ...originRect,
            x: rect.x - lastX,
            y: rect.y - lastY,
        }
    }, 1000);

    calcLimit();

    initCallback?.({
        minX,
        maxX,
        minY,
        maxY,
    });

    return makeDraggable(targetEl, (x, y) => {
        calcOrigin();

        calcLimit();

        // 限制 x 和 y 在父元素范围内
        const restrictedX = Math.max(minX, Math.min(maxX, x));
        const restrictedY = Math.max(minY, Math.min(maxY, y));

        lastX = restrictedX;
        lastY = restrictedY;

        setElmTranslate(targetEl, restrictedX, restrictedY);
    });
}
