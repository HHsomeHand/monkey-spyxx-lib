import {RefObject, useEffect, useRef} from "react";
import {makeEventListener, EventHandler} from "@/utils/makeEventListener.ts";

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
