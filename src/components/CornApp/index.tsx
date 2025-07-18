import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { memo } from "react";
import { makeDraggable } from "@/utils/makeDraggable.ts";
import cornMitt from "@/eventBus";
import {ShowToastOptions} from "@/types/eventBus.ts";

interface CornAppProps {
    className?: string;
    children?: React.ReactNode;
}

export const CornApp = memo((props: CornAppProps) => {
    const [toastMsg, setToastMsg] = useState("");
    const durationRef = useRef(300);

    useEffect(() => {
        if (toastMsg !== "") {
            const id = setTimeout(() => {
                setToastMsg("");
            }, durationRef.current);

            return () => {
                clearTimeout(id);
            }
        }
    }, [toastMsg]);

    useEffect(() => {
        function showToast({msg, duration}: ShowToastOptions) {
            setToastMsg(msg);
            durationRef.current = duration;
        }

        cornMitt.on('showToast', showToast);

        return () => {
            cornMitt.off('showToast', showToast);
        }
    }, []);

    return (
        <div className={clsx(props.className, "corn-app")}>
            {props.children}

            {
                toastMsg !== "" && (
                    <div className="bg-amber-400 p-3 fixed corn-center z-9999">{toastMsg}</div>
                )
            }
        </div>
    );
});

export default CornApp;
