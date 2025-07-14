import clsx from 'clsx';
import React, {useEffect, useRef, useState} from 'react';
import {memo} from "react";
import {Modal} from "antd";
import {makeDraggable} from "@/utils/makeDraggable.ts";
import makeEventListener from "@/utils/makeEventListener.ts";
import {Simulate} from "react-dom/test-utils";
import cancel = Simulate.cancel;
import CancelFnArr from "@/class/CancelFnArr.ts";

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

    function onResult(result: string) {
        props.onResult(result);
    }

    const handleOk = () => {
        setIsModalOpen(false);

        onResult("");
    };

    const handleCancel = () => {
        setIsModalOpen(false);

        onResult("");
    };

    const classNames = {
        mask: `!bg-transparent`,
        // content: `!px-4 !py-2`
    };

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cancelFnArr = new CancelFnArr();

        if (!containerRef.current) return;

        let dialogEl: Element;

        {
            let _dialogEl = containerRef.current.querySelector('.ant-modal-content');

            if (!_dialogEl) return;

            dialogEl = _dialogEl;
        }

        {
            const {cancel} = makeDraggable(dialogEl as HTMLElement);

            cancelFnArr.push(cancel);
        }

        function makeElStopPropagation(selector: string) {
            let contentEl = dialogEl.querySelector(selector);

            if (!contentEl) return;

            {
                const cancel = makeEventListener('mousedown', (e) => {
                    e.stopPropagation();
                }, contentEl);

                cancelFnArr.push(cancel);
            }
        }

        [
            ".ant-modal-header",
            ".ant-modal-body",
            ".ant-modal-footer",
        ].forEach((selector) => {
            makeElStopPropagation(selector);
        });

        return cancelFnArr.getDoCancelFn();
    }, []);

    return (
        <div ref={containerRef}>
            <Modal
                title={propTitle}

                classNames={classNames}
                closable={false} // 是否有关闭按钮
                keyboard={false} // esc 是否退出
                maskClosable={false} // 点击 mask 是否会关闭对话框

                getContainer={false} // 挂载在当前节点

                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}

                width={propWidth}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    );
});

export default UserSelectDialog;
