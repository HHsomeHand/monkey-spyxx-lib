import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { memo } from "react";
import { makeDraggable } from "@/utils/makeDraggable.ts";

interface CornAppProps {
    className?: string;
    children?: React.ReactNode;
}

export const CornApp = memo((props: CornAppProps) => {
    return (
        <div className={clsx(props.className, "corn-app")}>
            {props.children}
        </div>
    );
});

export default CornApp;
