import React, {memo, useEffect, useRef, useState} from "react";
import UserSelectDialog, {UserSelectDialogProps} from "@/components/dialog/UserSelectDialog";
import UserSelectDialogControllerWrapper from "./style.ts";
import { CSSTransition } from 'react-transition-group';

export const UserSelectDialogController = memo((
    props:  Omit<UserSelectDialogProps, 'onIsShowDialogChange'>
) => {
    const [isShowDialog, setIsShowDialog] = useState(true);

    const dialogRef = useRef<HTMLDivElement>(null);

    //  react-transition-group 不兼容 React19
    //  https://github.com/reactjs/react-transition-group/issues/918
    return (
        <UserSelectDialogControllerWrapper
            data-slot="user-select-dialog-controller"
        >
            <CSSTransition
                nodeRef={dialogRef}
                in={isShowDialog} // 控制动画触发
                timeout={300} // 动画持续时间（毫秒）
                classNames="dialog" // 动画类名前缀
                unmountOnExit // 退出时卸载组件
                appear={true}
            >
                <UserSelectDialog ref={dialogRef} onIsShowDialogChange={setIsShowDialog} {...props}/>
            </CSSTransition>
        </UserSelectDialogControllerWrapper>
    );
})
