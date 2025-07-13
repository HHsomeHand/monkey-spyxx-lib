import clsx from 'clsx';
import React, {useState} from 'react';
import {memo} from "react";
import {Modal} from "antd";

interface UserSelectDialogProps {
    className?: string,
    onResult: (result: string) => void,
    title?: string,
}

export const UserSelectDialog = memo((
    props: UserSelectDialogProps
) => {
    const {
        title: propsTitle = "请将光标移动到目标控件上"
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
    };

    return (
        <>
            <Modal
                title={propsTitle}

                className=""

                classNames={classNames}
                closable={false}
                keyboard={false}
                maskClosable={false}

                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    );
});

export default UserSelectDialog;
