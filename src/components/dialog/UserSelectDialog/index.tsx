// src/components/dialog/UserSelectDialog/index.tsx

import React, {useEffect, useRef} from 'react';
import {memo} from "react";
import {UserSelectDialogWrapper} from "./style.ts";
import {clsx} from "clsx";
import {CornDialog, CornDialogBody, CornDialogContent, CornDialogHeader} from "@/components/ui/dialog-base.tsx";
import CancelFnArr from '@/class/CancelFnArr.ts';
import {makeDraggable} from "@/utils/makeDraggable.ts";
import makeEventListener from "@/utils/makeEventListener.ts";
import {makeDraggableInContainer} from "@/utils/makeDraggableInContainer.ts";

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

    const containerRef = useRef<HTMLDivElement>(null);

    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cancelFnArr = new CancelFnArr();

        if (!containerRef.current) return;

        const dialogEl = containerRef.current;

        if (!bodyRef.current) return;

        const bodyEl = bodyRef.current;

        {
            const {cancel} = makeDraggableInContainer(dialogEl);

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

    useEffect(() => {
        const cancelFnArr = new CancelFnArr();

        const setCurrEl = (() => {
            let currEl: HTMLElement | null = null;

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
                if (currEl === el) {
                    return;
                }

                if (el.matches(".corn-app *, .corn-app")) {
                    return;
                }

                resetShadow();

                currEl = el;

                tmpBoxShadow = currEl.style.boxShadow;
            }

            cancelFnArr.push(() => {
                resetShadow();

                clearInterval(id);
            });

            return setCurrEl;
        })();

        const cancel = makeEventListener("mousemove", (e) => {
            const targetEl = document.elementFromPoint(e.clientX, e.clientY);

            if (!targetEl) {
                return;
            }

            setCurrEl(targetEl as HTMLElement);
        });

        cancelFnArr.push(cancel);

        return cancelFnArr.getDoCancelFn();
    }, []);


    return (
        <UserSelectDialogWrapper
            className={clsx("user-select-dialog", props.className)}
        >
            <CornDialog ref={containerRef}>
                <CornDialogContent>
                    <CornDialogHeader>
                        {propTitle}
                    </CornDialogHeader>

                    <CornDialogBody ref={bodyRef}>

                    </CornDialogBody>
                </CornDialogContent>
            </CornDialog>
        </UserSelectDialogWrapper>
    );
});



export default UserSelectDialog;
