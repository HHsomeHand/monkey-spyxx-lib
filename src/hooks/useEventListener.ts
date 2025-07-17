import {RefObject, useEffect, useRef} from "react";
import {makeEventListener, EventHandler} from "@/utils/makeEventListener.ts";

export function useEventListener<
    T extends Element,
    K extends keyof DocumentEventMap,
>(
    target: RefObject<T>,
    event: K,
    listener: EventHandler<T, K>,
    options: boolean | AddEventListenerOptions = false,
) {
    useEffect(() => {
        if (!target.current) return;

        return makeEventListener(event, listener, target.current, options);
    }, [target.current, listener]);
}

export default useEventListener;
