import React, {memo, useEffect, useRef, useState} from "react";
import UserSelectDialogControllerWrapper from "./style.ts";
import { CSSTransition } from 'react-transition-group';
import {
    UserSelectDialog,
    UserSelectDialogProps
} from "./c-cpns/UserSelectDialog";

/*
    不需要再 memo 了, 使用 react 官方的 react-compiler: https://react.dev/learn/react-compiler/installation

    react-compiler 会自动添加 memo, 非常智能.

    const CpnName = memo(() => {})

    这种方式定义函数式组件, 会导致 react 开发者工具, 显示一整片的匿名函数
 */

// 介绍: 控制 UserSelectDialog 的显示和隐藏, 以及过渡效果
export function UserSelectDialogController(
    props:  Omit<UserSelectDialogProps, 'onIsShowDialogChange' | 'isShowDialog'>
) {
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
                <UserSelectDialog ref={dialogRef} isShowDialog={isShowDialog} onIsShowDialogChange={setIsShowDialog} {...props}/>
            </CSSTransition>
        </UserSelectDialogControllerWrapper>
    );
}
