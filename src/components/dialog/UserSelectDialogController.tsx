import React, {memo, useState} from "react";
import UserSelectDialog, {UserSelectDialogProps} from "@/components/dialog/UserSelectDialog";

export const UserSelectDialogController = memo((
    props:  Omit<UserSelectDialogProps, 'isShowDialog' | 'onIsShowDialogChange'>
) => {
    const [isShowDialog, setIsShowDialog] = useState(true);

    return isShowDialog && (
        <UserSelectDialog {...props} onIsShowDialogChange={setIsShowDialog}/>
    );
})
