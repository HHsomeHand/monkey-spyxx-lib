import {RefObject, useEffect, useRef} from "react";
import makeEventListener from "@/utils/makeEventListener.ts";

type EventHandler<T, K extends keyof DocumentEventMap> = (
    this: T,
    ev: DocumentEventMap[K],
) => any;

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
    }, [target.current]);
}

export default useEventListener;
