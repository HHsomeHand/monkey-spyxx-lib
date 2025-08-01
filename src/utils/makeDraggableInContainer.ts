import {makeDraggable, setElmTranslate} from "@/utils/makeDraggableV2.ts";
import {throttle} from "lodash";
import CCancelFnArr from "@/class/CCancelFnArr.ts";
import makeEventListener from "@/utils/makeEventListener.ts";

export interface IMakeDraggableInContainerProps {
    gapX?: number,
    gapY?: number,
    throttleWait?: number,
    containerEl?: HTMLElement | Window,
    initCallback?: (options: {minX: number, maxX: number, minY: number, maxY: number}) => void
}

// 拖拽通过 translate 实现, 如果 targetEl 本身有 translate, 请移动到 transform, 让二者叠加就 ok
export function makeDraggableInContainer(
    draggableEl: HTMLElement,
    options: IMakeDraggableInContainerProps = {}
) {
    let {
        gapX: optionGapX = 0,
        gapY: optionGapY = 0,
        throttleWait: optionThrottleWait = 1000,
        containerEl: optionContainerEl = window, // 很多网站 body 宽高都为 0 (如 youtube tailwind 官网), 如果通过 window.body 会导致显示不正常, 出现消失等问题
        initCallback: optionInitCallback = () => {}
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
        let rect: DOMRect;
        if (optionContainerEl instanceof Window) {
            rect = getWindowBoundingClientRect();
        } else {
            rect = optionContainerEl.getBoundingClientRect();
        }

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

    let cancelFnArr = new CCancelFnArr();


    function onSizeChange() {
        calcOrigin();

        calcLimit();

        const {x, y} = setTranslate(lastX, lastY)

        result.setPos(x, y);
    }
    // 创建观察器实例
    const resizeObserver = new ResizeObserver(onSizeChange);

    // 开始监听目标元素
    resizeObserver.observe(draggableEl);

    // 这里用 optionContainerEl === window 是因为 optionContainerEl 可能为 window 的 proxy
    // window 的 proxy instanceof Window 是 false
    if (
        optionContainerEl === window ||
        optionContainerEl instanceof Window
    ) {
        const cancelFn = makeEventListener("resize", onSizeChange);

        cancelFnArr.push(cancelFn);
    } else {
        resizeObserver.observe(optionContainerEl);

        cancelFnArr.push(() => {
            resizeObserver.unobserve(draggableEl);
            resizeObserver.unobserve(optionContainerEl);
        })
    }

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

        setElmTranslate(draggableEl, restrictedX, restrictedY);

        return {
            x: lastX,
            y: lastY,
        }
    }

    const result = makeDraggable(draggableEl, (x, y) => {
        calcLimitThrottle();

        setTranslate(x, y);
    });


    cancelFnArr.push(result.cancel);

    return {
        ...result,
        cancel() {
            cancelFnArr.doCancel();
        }
    }
}

function getWindowBoundingClientRect(): DOMRect {
    const rect = {
        top: 0,
        left: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        width: window.innerWidth,
        height: window.innerHeight,
        x: 0,
        y: 0
    };
    return {
        ...rect,
        toJSON() {
            return rect;
        }
    };
}
