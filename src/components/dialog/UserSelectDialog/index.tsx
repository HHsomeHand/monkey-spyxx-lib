// src/components/dialog/UserSelectDialog/index.tsx

import React from 'react';
import {memo} from "react";
import {UserSelectDialogWrapper} from "./style.ts";
import {clsx} from "clsx";

interface UserSelectDialogProps {
    className?: string,
}

export const UserSelectDialog = memo((
    props:  UserSelectDialogProps
) => {
    return (
        <UserSelectDialogWrapper
            className={clsx("user-select-dialog", props.className)}
        >
            <div className="bg-gray-300 w-100 h-200 fixed top-[50%] left-[50%] " data-slot="dialog">
                <div data-slot="dialog__content">

                </div>
            </div>
        </UserSelectDialogWrapper>
    );
});

export default UserSelectDialog;
