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
