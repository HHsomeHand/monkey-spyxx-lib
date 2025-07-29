import {makeDraggableInContainer, IMakeDraggableInContainerProps} from "@/utils/makeDraggableInContainer.ts";
import {useEffect, useRef} from "react";
import CancelFnArr from "@/class/CancelFnArr.ts";
import makeEventListener from "@/utils/makeEventListener.ts";

export function useDraggableContainer(options: IMakeDraggableInContainerProps = {}) {
    const draggableRef = useRef<HTMLDivElement>(null);

    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cancelFnArr = new CancelFnArr();

        if (!draggableRef.current) return;

        const dialogEl = draggableRef.current;

        if (!innerRef.current) return;

        const bodyEl = innerRef.current;

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
        draggableRef,
        innerRef,
    }
}
