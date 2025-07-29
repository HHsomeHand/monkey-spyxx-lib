import {
    corn_makeDraggableInContainer as makeDraggableInContainer,
    ICornMakeDraggableInContainerProps
} from "@/utils/makeDraggableInContainerV3.ts";
import {MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState} from "react";

/**
 *     const [draggableStyle, setDraggableStyle] = useState<CSSProperties>({});
 *
 *     const {draggableProps, innerProps, draggableRef} = useDraggableContainer({
 *         onStyleChange(newStyle) {
 *             setDraggableStyle({
 *                 ...draggableStyle,
 *                 ...newStyle,
 *             })
 *         }
 *     });
 */
export function corn_useDraggableContainer(options: ICornMakeDraggableInContainerProps) {
    const draggableRef = useRef<HTMLDivElement>(null);

    const [makeDraggableReturnValue, setMakeDraggableReturnValue] = useState<ReturnType<typeof makeDraggableInContainer> | null>(null);

    useEffect(() => {
        if (!draggableRef.current) return;

        const containerEl = draggableRef.current;

        setMakeDraggableReturnValue(makeDraggableInContainer(containerEl, options));
    }, [draggableRef.current])

    const draggableProps = makeDraggableReturnValue?.draggableProps;

    const onMouseDown: MouseEventHandler = useCallback((event) => {
        event.stopPropagation();
    }, []);

    const innerProps = {
        onMouseDown,
    }

    useEffect(() => {
        return makeDraggableReturnValue?.cancel;
    }, [makeDraggableReturnValue]);

    return {
        draggableRef,
        draggableProps,
        innerProps,
    }
}
