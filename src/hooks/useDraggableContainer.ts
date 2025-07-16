import {makeDraggableInContainer, MakeDraggableInContainerProps} from "@/utils/makeDraggableInContainer.ts";
import {useEffect, useRef} from "react";
import CancelFnArr from "@/class/CancelFnArr.ts";
import makeEventListener from "@/utils/makeEventListener.ts";

export function useDraggableContainer(options: Partial<MakeDraggableInContainerProps> = {}) {
    const containerRef = useRef<HTMLDivElement>(null);

    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cancelFnArr = new CancelFnArr();

        if (!containerRef.current) return;

        const dialogEl = containerRef.current;

        if (!bodyRef.current) return;

        const bodyEl = bodyRef.current;

        {
            const {cancel} = makeDraggableInContainer(dialogEl, options);

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
