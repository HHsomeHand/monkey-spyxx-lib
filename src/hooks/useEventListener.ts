import {RefObject, useEffect, useRef} from "react";
import {makeEventListener, EventHandler} from "@/utils/makeEventListener.ts";

// target 不应该传 ref, 如果传 ref, 就没办法传 window 了
export function useEventListener<
    T extends Element | Document | Window,
    K extends keyof DocumentEventMap,
>(
    target: T | null,
    event: K,
    listener: EventHandler<T, K>,
    options: boolean | AddEventListenerOptions = false,
) {
    useEffect(() => {
        if (!target) return;

        return makeEventListener(event, listener, target, options);
    }, [target, listener]);
}

export default useEventListener;
