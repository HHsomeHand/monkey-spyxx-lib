// src/components/dialog/UserSelectDialog/index.tsx

import React, {useEffect, useRef, useState} from 'react';
import {memo} from "react";
import {UserSelectDialogWrapper} from "./style.ts";
import {clsx} from "clsx";
import {CornDialog, CornDialogBody, CornDialogContent, CornDialogHeader} from "@/components/ui/dialog-base.tsx";
import CancelFnArr from '@/class/CancelFnArr.ts';
import {makeDraggable} from "@/utils/makeDraggable.ts";
import makeEventListener from "@/utils/makeEventListener.ts";
import {makeDraggableInContainer} from "@/utils/makeDraggableInContainer.ts";
import {getSelector} from "@/utils/getSelector.ts";
import {useDraggableContainer} from "@/hooks/useDraggableContainer.ts";

interface UserSelectDialogProps {
    className?: string,
    title?: string,
    onResult?: (selector: string) => void;
}

export const UserSelectDialog = memo((
    props:  UserSelectDialogProps
) => {
    let {
        title: propTitle = ""
    } = props;

    const {bodyRef, containerRef} = useDraggableContainer();

    const [currSelector, setCurrSelector] = useState("");

    const setPauseSelectRef = useRef<(isCancel: boolean) => void>();

    useEffect(() => {
        const cancelFnArr = new CancelFnArr();

        const {setCurrEl, setPauseSelect} = (() => {
            let currEl: HTMLElement | null = null;

            let isPauseSelect: boolean = false;

            let tmpBoxShadow = "";

            const id = setInterval(() => {
                if (!currEl) return;

                /* x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
                currEl.style.boxShadow = "0px 0px 0px 2px red"
            });

            function resetShadow() {
                if (currEl) {
                    currEl.style.boxShadow = tmpBoxShadow;
                }
            }

            function setCurrEl(el: HTMLElement) {
                if (isPauseSelect) {
                    return;
                }

                if (currEl === el) {
                    return;
                }

                if (el.matches(".corn-app *, .corn-app")) {
                    return;
                }

                resetShadow();

                currEl = el;

                tmpBoxShadow = currEl.style.boxShadow;

                setCurrSelector(getSelector(currEl).selector);
            }

            cancelFnArr.push(() => {
                resetShadow();

                clearInterval(id);
            });

            function setPauseSelect(paramIsPauseSelect: boolean) {
                isPauseSelect = paramIsPauseSelect;
            }

            return {
                setCurrEl,
                setPauseSelect
            }
        })();

        setPauseSelectRef.current = setPauseSelect;

        {
            const cancel = makeEventListener("mousemove", (e) => {
                const targetEl = document.elementFromPoint(e.clientX, e.clientY);

                if (!targetEl) {
                    return;
                }

                setCurrEl(targetEl as HTMLElement);
            });

            cancelFnArr.push(cancel);
        }

        {
            const cancel = makeEventListener("click", (e) => {
                setPauseSelect(true);
            }, window, true);
        }

        return cancelFnArr.getDoCancelFn();
    }, []);

    function _DialogBody() {
        return  (
            <>
                {
                    currSelector !== "" && <p>
                        {currSelector}
                    </p>
                }

                <p>
                    划过下方的感应区, 继续进行选择:
                </p>

                <div
                    className="w-10 h-5 bg-background"
                    onMouseMove={e => {
                        setPauseSelectRef.current?.(false);
                    }}
                >

                </div>
            </>
        )
    }


    return (
        <UserSelectDialogWrapper
            className={clsx("user-select-dialog", props.className)}
        >
            <CornDialog ref={containerRef}>
                <CornDialogContent>
                    <CornDialogHeader>
                        {propTitle}
                    </CornDialogHeader>

                    <CornDialogBody className="flex flex-col gap-3 p-2" ref={bodyRef}>
                        {_DialogBody()}
                    </CornDialogBody>
                </CornDialogContent>
            </CornDialog>
        </UserSelectDialogWrapper>
    );
});



export default UserSelectDialog;
