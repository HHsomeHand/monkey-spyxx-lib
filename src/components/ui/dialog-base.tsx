import clsx from "clsx";
import React from "react";

export function CornDialog({
    children,
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={clsx(`text-text bg-background border-border border-1 w-100 h-50 z-999 fixed corn-center rounded-lg px-4 pb-4`, className)}
            {...props}
            data-slot="dialog"
        >
            {children}
        </div>
    )
}


export function CornDialogSection({
   children,
   className,
   ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={clsx("w-full h-full flex flex-col", className)} data-slot="dialog__section">
            {children}
        </div>
    )
}

export function CornDialogTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={clsx("text-base/12 text-center font-bold", className)} data-slot="dialog__title">
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
        <div className={clsx("grow bg-content rounded-lg", className)} data-slot="dialog__content">
            {children}
        </div>
    )
}
