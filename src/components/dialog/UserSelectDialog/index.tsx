// src/components/dialog/UserSelectDialog/index.tsx

import React from 'react';
import {memo} from "react";
import {UserSelectDialogWrapper} from "./style.ts";
import {clsx} from "clsx";
import {CornDialog, CornDialogContent, CornDialogSection, CornDialogTitle} from "@/components/ui/dialog-base.tsx";

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
            <CornDialog>
                <CornDialogSection>
                    <CornDialogTitle>
                        {propTitle}
                    </CornDialogTitle>

                    <CornDialogContent>

                    </CornDialogContent>
                </CornDialogSection>
            </CornDialog>
        </UserSelectDialogWrapper>
    );
});



export default UserSelectDialog;
