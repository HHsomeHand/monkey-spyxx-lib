import {makeDraggableInContainerV2, MakeDraggableInContainerProps} from "@/utils/makeDraggableInContainerV2.ts";
import {useEffect, useRef} from "react";
import CancelFnArr from "@/class/CancelFnArr.ts";
import makeEventListener from "@/utils/makeEventListener.ts";

export function useDraggableContainerV2(options: Partial<MakeDraggableInContainerProps> = {}) {
    const containerRef = useRef<HTMLDivElement>(null);

    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cancelFnArr = new CancelFnArr();

        if (!containerRef.current) return;

        const dialogEl = containerRef.current;

        if (!bodyRef.current) return;

        const bodyEl = bodyRef.current;

        {
            const {cancel} = makeDraggableInContainerV2(dialogEl, options);

            cancelFnArr.push(cancel);
        }

        {
            const cancel = makeEventListener('mousedown', (e) => {
                e.stopPropagation();
            }, bodyEl);

            cancelFnArr.push(cancel);
        }

        return cancelFnArr.getDoCancelFn();
    }, []);

    return {
        containerRef,
        bodyRef,
    }
}
