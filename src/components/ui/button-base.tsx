import React, {useRef} from "react";
import clsx from "clsx";
import useWindowEventListener from "@/hooks/useWindowEventListener.ts";
import {EventHandler} from "@/utils/makeEventListener.ts";
import useRefEventListener from "@/hooks/useRefEventListener.ts";

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

    useRefEventListener(btnRef, "click", onClick);

    return (
        <button
            ref={btnRef}
            className={clsx('hover:bg-neutral-200! active:bg-neutral-400! p-0.5! rounded-sm transition-all ', className)}
            {...props}
            data-slot="button"
        >
            {children}
        </button>
    )
}
