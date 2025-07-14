import clsx from 'clsx';
import React, {useEffect, useRef, useState} from 'react';
import {memo} from "react";
import {Modal} from "antd";
import {makeDraggable} from "@/utils/makeDraggable.ts";
import makeEventListener from "@/utils/makeEventListener.ts";
import {Simulate} from "react-dom/test-utils";
import cancel = Simulate.cancel;
import CancelFnArr from "@/class/CancelFnArr.ts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface UserSelectDialogProps {
    className?: string,
    onResult: (result: string) => void,
    title?: string,
    width?: number,
}

export const UserSelectDialog = memo((
    props: UserSelectDialogProps
) => {
    const {
        title: propTitle = "请将光标移动到目标控件上",
        width: propWidth = 200,
    } = props;

    const [isModalOpen, setIsModalOpen] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     const cancelFnArr = new CancelFnArr();
    //
    //     if (!containerRef.current) return;
    //
    //     let dialogEl: Element;
    //
    //     {
    //         let _dialogEl = containerRef.current.querySelector('.ant-modal-content');
    //
    //         if (!_dialogEl) return;
    //
    //         dialogEl = _dialogEl;
    //     }
    //
    //     {
    //         const {cancel} = makeDraggable(dialogEl as HTMLElement);
    //
    //         cancelFnArr.push(cancel);
    //     }
    //
    //     function makeElStopPropagation(selector: string) {
    //         let contentEl = dialogEl.querySelector(selector);
    //
    //         if (!contentEl) return;
    //
    //         {
    //             const cancel = makeEventListener('mousedown', (e) => {
    //                 e.stopPropagation();
    //             }, contentEl);
    //
    //             cancelFnArr.push(cancel);
    //         }
    //     }
    //
    //     [
    //         ".ant-modal-header",
    //         ".ant-modal-body",
    //         ".ant-modal-footer",
    //     ].forEach((selector) => {
    //         makeElStopPropagation(selector);
    //     });
    //
    //     return cancelFnArr.getDoCancelFn();
    // }, []);

    return (
        <div ref={containerRef}>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader >
                        <DialogTitle>{propTitle}</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    );
});

export default UserSelectDialog;
