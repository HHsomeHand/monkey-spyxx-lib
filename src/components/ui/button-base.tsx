import React, {useRef} from "react";
import clsx from "clsx";
import useEventListener from "@/hooks/useEventListener.ts";
import {EventHandler} from "@/utils/makeEventListener.ts";

export type OnBtnClickFnTYpe =  EventHandler<HTMLButtonElement, 'click'>;

export function CornButton({
    children,
    className,
    onClick,
    ...props
}: Omit<React.ComponentProps<"button">, 'onClick'> & {
    onClick: OnBtnClickFnTYpe
}) {
    const btnRef = useRef<HTMLButtonElement>(null);

    useEventListener(btnRef, "click", onClick);

    return (
        <button
            ref={btnRef}
            className={clsx(`bg-background border-border border-2`, className)}
            {...props}
            data-slot="button"
        >
            {children}
        </button>
    )
}
