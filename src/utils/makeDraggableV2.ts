import makeEventListener from "@/utils/makeEventListener.ts";

export function setElmTranslate(elm: HTMLElement, x: number, y: number) {
    elm.style.transform = `translate(${x}px, ${y}px)`;
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
 * @param Ele 目标元素
 * @param callback
 */
export function makeDraggable(Ele: HTMLElement, callback: (x: number, y: number) => void) {
    let scale = 1;
    let originX = 0;
    let originY = 0;
    let isDragging = false;
    let startX: number, startY: number;

    Ele.style.cursor = "grab";

    type cancelCallbackArrType = ReturnType<typeof makeEventListener>[];
    let cancelCallbackArr: cancelCallbackArrType = [];

    const cancelMouseDown = makeEventListener(
        "mousedown",
        (event) => {
            event.stopPropagation();
            event.preventDefault();

            isDragging = true;

            startX = event.clientX;
            startY = event.clientY;

            Ele.style.cursor = "grabbing";
            Ele.style.animationDuration = "0s";
        },
        Ele,
    );
    cancelCallbackArr.push(cancelMouseDown);

    Ele.onclick = (event) => event.stopPropagation();

    const cancelMouseUp = makeEventListener("mouseup", (event) => {
        event.stopPropagation();
        event.preventDefault();
        isDragging = false;

        Ele.style.cursor = "grab";
        Ele.style.animationDuration = "";
    });
    cancelCallbackArr.push(cancelMouseUp);

    const cancelMouseMove = makeEventListener("mousemove", (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (!isDragging) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        originX += dx;
        originY += dy;

        startX = event.clientX;
        startY = event.clientY;

        callback(originX, originY);
    });
    cancelCallbackArr.push(cancelMouseMove);

    function reset() {
        scale = 1;
        originX = 0;
        originY = 0;

        callback(originX, originY);
    }

    return {
        reset,
        cancel() {
            for (const cancelFn of cancelCallbackArr) {
                reset();
                cancelFn();
            }
        }, // cancel() {
        setPos(x: number, y: number) {
            originX = x;
            originY = y;
        }
    };
}
