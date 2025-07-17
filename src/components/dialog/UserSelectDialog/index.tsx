// src/components/dialog/UserSelectDialog/index.tsx

import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {UserSelectDialogWrapper} from "./style.ts";
import {clsx} from "clsx";
import {CornDialog, CornDialogBody, CornDialogContent, CornDialogHeader} from "@/components/ui/dialog-base.tsx";
import {getSelector} from "@/utils/getSelector.ts";
import {useDraggableContainer} from "@/hooks/useDraggableContainer.ts";
import useEventListener from "@/hooks/useEventListener.ts";
import {CornButton, OnBtnClickFnTYpe} from "@/components/ui/button-base.tsx";
import {throttle} from "lodash";
import {useStateRef} from "@/hooks/useStateRef.ts";

export interface UserSelectDialogProps {
    className?: string,
    title?: string,
    onResult?: (selector: string) => void;
    onIsShowDialogChange?: (newIsShowDialog: boolean) => void;
}

export const UserSelectDialog = memo((
    props:  UserSelectDialogProps
) => {
    let {
        title: propTitle = ""
    } = props;

    const {bodyRef, containerRef} = useDraggableContainer();

    const [currSelectedEl, private_setCurrSelectedEl, getCurrSelectedEl] = useStateRef<HTMLElement | null>(null);

    function setCurrSelectedEl(el: HTMLElement) {
        if (currSelectedEl === el) {
            return;
        }

        if (el.matches(".corn-app *, .corn-app")) {
            return;
        }

        private_setCurrSelectedEl(el);
    }

    let preBoxShadowRef = useRef("");

    // 实现 shadowBox 的保存与回复
    useEffect(() => {
        if (!currSelectedEl) return;

        const savedPreEl = currSelectedEl;

        preBoxShadowRef.current = savedPreEl.style.boxShadow;

        function resetShadow() {
            savedPreEl.style.boxShadow = preBoxShadowRef.current;
        }

        return () => {
            resetShadow();
        }
    }, [currSelectedEl]);

    const currSelectorArr = useMemo(() => {
        if (!currSelectedEl) {
            return [];
        }

        return getSelector(currSelectedEl).pathArray;
    }, [currSelectedEl])

    // 设置 shadowBox
    useEffect(() => {
        const id = setInterval(() => {
            const l_currSelectedEl = getCurrSelectedEl();
            if (!l_currSelectedEl) return;

            /* x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
            l_currSelectedEl.style.boxShadow = "0px 0px 0px 2px red"
        }, 100);

        return () => {
            clearInterval(id);
        }
    }, []);

    const [isPauseSelected, setIsPauseSelected, getIsPauseSelected] = useStateRef(false);

    // 实现鼠标移动选中元素
    useEventListener(window, 'mousemove', useCallback(throttle((e) => {
        if (getIsPauseSelected()) {
            return;
        }

        const targetEl = document.elementFromPoint(e.clientX, e.clientY);

        if (!targetEl) {
            return;
        }

        setCurrSelectedEl(targetEl as HTMLElement);
    }, 100), []));

    // 实现点击暂停监听
    useEventListener(window, 'click', useCallback((e) => {
        if (!getIsPauseSelected()) {
            e.stopPropagation();
            e.preventDefault();
        }

        setIsPauseSelected(true);
    }, []), true);

    const onCancelBtnClick: OnBtnClickFnTYpe =  useCallback(() => {
        props.onResult?.(currSelectorArr.join(" > "));

        props.onIsShowDialogChange?.(false);
    }, []);

    return (
        <UserSelectDialogWrapper
            className={clsx("user-select-dialog", props.className)}
        >
            <CornDialog ref={containerRef}>
                <CornDialogContent>
                    <CornDialogHeader>
                        {propTitle}
                    </CornDialogHeader>

                    <CornDialogBody className="flex flex-col gap-3 p-2" ref={bodyRef}>
                        {_DialogBody()}
                    </CornDialogBody>
                </CornDialogContent>
            </CornDialog>
        </UserSelectDialogWrapper>
    );

    function _DialogBody() {
        return  (
            <>
                <_SelectorDisplayer/>

                <p>
                    当前选择状态: {isPauseSelected ? "暂停" : "未暂停"}
                </p>

                <p>
                    划过下方的感应区, 继续进行选择:
                </p>

                <div
                    className="w-10 h-5 bg-background"
                    onMouseMove={e => {
                        setIsPauseSelected(false);
                    }}
                >
                </div>

                <CornButton onClick={onCancelBtnClick}>
                    提交
                </CornButton>
            </>
        )
    }

    function _SelectorDisplayer() {
        const [showIndex, setShowIndex] = useState(-1);

        let showLength = currSelectorArr.length;

        let showList = currSelectorArr;

        if (showIndex !== -1) {
            showList = currSelectorArr.slice(0, showIndex + 1);

            showLength = showIndex + 1;
        }

        return (
            <>
                {
                    currSelectorArr.length !== 0 && <section className="flex flex-wrap">
                        {
                            showList.map((selector, index) => {
                                function onSelectorClick() {
                                    setShowIndex(index);
                                }

                                return (
                                    <React.Fragment key={selector}>
                                        <CornButton onClick={onSelectorClick}>{selector}</CornButton>
                                        {
                                            index < showLength - 1 && (
                                                <div className="mx-1">&gt;</div>
                                            )
                                        }
                                    </React.Fragment>
                                )
                            })
                        }
                    </section>
                }
            </>
        )
    }
});


export default UserSelectDialog;
