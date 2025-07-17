import {RefObject, useEffect, useRef} from "react";
import {makeEventListener, EventHandler} from "@/utils/makeEventListener.ts";

// target 不应该传 ref, 如果传 ref, 就没办法传 window 了
export function useWindowEventListener<
    K extends keyof DocumentEventMap,
>(
    event: K,
    listener: EventHandler<Window, K>,
    options: boolean | AddEventListenerOptions = false,
) {
    useEffect(() => {
        return makeEventListener(event, listener, window, options);
    }, [listener]);
}

export default useWindowEventListener;
