import React, {memo, useEffect, useRef, useState} from "react";
import UserSelectDialogControllerWrapper from "./style.ts";
import {
    SpyxxUserSelectDialog,
    SpyxxUserSelectDialogProps
} from "./c-cpns/UserSelectDialog";

/*
    不需要再 memo 了, 使用 react 官方的 react-compiler: https://react.dev/learn/react-compiler/installation

    react-compiler 会自动添加 memo, 非常智能.

    const CpnName = memo(() => {})

    这种方式定义函数式组件, 会导致 react 开发者工具, 显示一整片的匿名函数
 */

export function UserSelectDialogController(
    props:  Omit<SpyxxUserSelectDialogProps, 'onIsShowDialogChange' | 'isShowDialog'>
) {
    const [isShowDialog, setIsShowDialog] = useState(true);

    return (
        <UserSelectDialogControllerWrapper
            data-slot="user-select-dialog-controller"
        >
            <SpyxxUserSelectDialog isShowDialog={isShowDialog} onIsShowDialogChange={setIsShowDialog} {...props}/>
        </UserSelectDialogControllerWrapper>
    );
}
