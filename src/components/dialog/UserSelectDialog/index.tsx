// src/components/dialog/UserSelectDialog/index.tsx

import React from 'react';
import {memo} from "react";
import {UserSelectDialogWrapper} from "./style.ts";
import {clsx} from "clsx";

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

    return (
        <UserSelectDialogWrapper
            className={clsx("user-select-dialog", props.className)}
        >
            <div className="text-text bg-background border-border border-1 w-100 h-50 z-999 fixed corn-center rounded-lg" data-slot="dialog">
                <div className="w-full h-full flex flex-col" data-slot="dialog__section">
                    <div className="text-base/12 text-center font-bold" data-slot="dialog__title">
                        {propTitle}
                    </div>

                    <div className="grow bg-content rounded-lg mx-4 mb-4" data-slot="dialog__content">

                    </div>
                </div>
            </div>
        </UserSelectDialogWrapper>
    );
});

export default UserSelectDialog;
