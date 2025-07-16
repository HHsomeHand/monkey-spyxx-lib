import clsx from "clsx";
import React from "react";

export function CornDialog({
    children,
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={clsx(`text-text bg-background border-border border-1 w-100 h-50 z-999 fixed top-0 left-0 rounded-lg px-4 pb-4`, className)}
            {...props}
            data-slot="dialog"
        >
            {children}
        </div>
    )
}


export function CornDialogContent({
   children,
   className,
   ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={clsx("w-full h-full flex flex-col", className)}
            data-slot="dialog__content"
            {...props}
        >
            {children}
        </div>
    )
}

export function CornDialogHeader({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={clsx("text-base/12 text-center font-bold", className)}
            data-slot="dialog__title"
            {...props}
        >
            {children}
        </div>
    )
}

export function CornDialogBody({
    children,
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={clsx("grow bg-content rounded-lg cursor-default", className)}
            data-slot="dialog__body"
            {...props}
        >
            {children}
        </div>
    )
}
