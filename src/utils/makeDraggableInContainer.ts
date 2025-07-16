import {makeDraggable, setElmTranslate} from "@/utils/makeDraggableV2.ts";
import {throttle} from "lodash";

interface MakeDraggableInContainerProps {
    gapX: number,
    gapY: number,
    throttleWait: number,
    containerEl: HTMLElement,
    initCallback: (options: {minX: number, maxX: number, minY: number, maxY: number}) => void
}

// 拖拽通过 translate 实现, 如果 targetEl 本身有 translate, 请移动到 transform, 让二者叠加就 ok
export function makeDraggableInContainer(
    targetEl: HTMLElement,
    options: Partial<MakeDraggableInContainerProps> = {}
) {
    let {
        gapX: optionGapX = 0,
        gapY: optionGapY = 0,
        throttleWait: optionThrottleWait = 1000,
        containerEl: optionContainerEl = document.body,
        initCallback: optionInitCallback = () => {}
   } = options;

    let minX: number = 0;
    let maxX: number = 0;
    let minY: number = 0;
    let maxY: number = 0;

    let originRect = targetEl.getBoundingClientRect();

    const calcLimit = throttle(() => {
        let targetWidth = targetEl.offsetWidth;
        let targetHeight = targetEl.offsetHeight;

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
    }, optionThrottleWait);

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
    }, optionThrottleWait);

    // 创建观察器实例
    const resizeObserver = new ResizeObserver(() => {
        setTranslate(lastX, lastY)
    });

    // 开始监听目标元素
    resizeObserver.observe(targetEl);
    resizeObserver.observe(optionContainerEl);

    calcLimit();

    optionInitCallback({
        minX,
        maxX,
        minY,
        maxY,
    });

    function setTranslate(x: number, y: number) {
        calcOrigin();

        calcLimit();

        // 限制 x 和 y 在父元素范围内
        const restrictedX = Math.max(minX, Math.min(maxX, x));
        const restrictedY = Math.max(minY, Math.min(maxY, y));

        lastX = restrictedX;
        lastY = restrictedY;

        setElmTranslate(targetEl, restrictedX, restrictedY);
    }

    const result = makeDraggable(targetEl, (x, y) => {
        setTranslate(x, y);
    });

    return {
        ...result,
        cancel() {
            result.cancel();

            resizeObserver.unobserve(targetEl);
            resizeObserver.unobserve(optionContainerEl);
        }
    }
}
