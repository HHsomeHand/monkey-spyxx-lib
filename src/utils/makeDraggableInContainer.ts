import {makeDraggable, setElmTranslate} from "@/utils/makeDraggableV2.ts";
import {throttle} from "lodash";

interface MakeDraggableInContainerProps {
    gapX: number,
    gapY: number,
}

// 仅适合 targetEl 作为 absolute 或 fixed 元素, top: 0; left 0; 的情况, 不适合其他情况
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

    const calcLimit = throttle(() => {
        let targetWidth = targetEl.offsetWidth;
        let targetHeight = targetEl.offsetHeight;

        // 获取父元素边界
        const rect = containerEl.getBoundingClientRect();
        minX = rect.left + options.gapX; // 左边界
        maxX = rect.right - targetWidth - options.gapX; // 右边界
        minY = rect.top + options.gapY; // 上边界
        maxY = rect.bottom - targetHeight - options.gapY; // 下边界
    }, 500);

    calcLimit();

    initCallback?.({
        minX,
        maxX,
        minY,
        maxY,
    });

    return makeDraggable(targetEl, (x, y) => {
        calcLimit();

        // 限制 x 和 y 在父元素范围内
        const restrictedX = Math.max(minX, Math.min(maxX, x));
        const restrictedY = Math.max(minY, Math.min(maxY, y));

        console.log(restrictedX, restrictedY);

        setElmTranslate(targetEl, restrictedX, restrictedY);
    });
}
