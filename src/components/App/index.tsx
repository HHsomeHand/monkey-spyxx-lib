import clsx from 'clsx';
import React, {useEffect, useRef} from 'react';
import {memo} from "react";
import {useDraggable} from "@/utils/useDraggable.ts";

interface AppProps {
    className?: string,
}

export const App = memo((
    props: AppProps
) => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (divRef.current) {
            useDraggable(divRef.current);

            divRef.current.addEventListener('mousedown', () => {
               console.log("mousedown")
            });
        }
    }, [divRef.current]);

    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (innerRef.current) {
            innerRef.current.addEventListener("mousedown", event => {
                event.stopPropagation();
            })
        }
    }, []);


    return (
        <div
            ref={divRef}
            className={clsx(
                props.className,
                "p-20 bg-amber-400 absolute top-0 left-0"
            )}
        >
            <div
                ref={innerRef}
                className="w-20 h-30 bg-white cursor-default"
            >
                inner
            </div>

        </div>
    );
});

export default App;
