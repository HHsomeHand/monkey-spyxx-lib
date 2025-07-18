// src/components/dialog/UserSelectDialog/index.tsx

import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {UserSelectDialogWrapper} from "./style.ts";
import {clsx} from "clsx";
import {CornDialog, CornDialogBody, CornDialogContent, CornDialogHeader} from "@/components/ui/dialog-base.tsx";
import {getSelector} from "@/utils/getSelector.ts";
import {useDraggableContainer} from "@/hooks/useDraggableContainer.ts";
import useWindowEventListener from "@/hooks/useWindowEventListener.ts";
import {CornButton, OnBtnClickFnTYpe} from "@/components/ui/button-base.tsx";
import {throttle} from "lodash";
import {useStateRef} from "@/hooks/useStateRef.ts";
import useCommittedRef from "@/hooks/useCommittedRef.ts";
import useMemoRef from "@/hooks/useMemoRef.ts";
import CornSelectorDisplayer, {
    CornSelectorDisplayerRef
} from "@/components/dialog/UserSelectDialog/c-cpns/CornSelectorDisplayer";

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

    const [currSelectedEl, private_setCurrSelectedEl, getCurrSelectedEl] = useStateRef<HTMLElement | null>(null);

    // 对 private_setCurrSelectedEl 进行封装, 避免选到对话框上的元素
    function setCurrSelectedEl(el: HTMLElement) {
        if (currSelectedEl === el) {
            return;
        }

        if (el.matches(".corn-app *, .corn-app")) {
            return;
        }

        private_setCurrSelectedEl(el);
    }

    // 保存选中元素的阴影样式, 方便选中下一个时, 恢复
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

    const [currSelectorArr, getCurrSelectorArr] = useMemoRef<string[]>(() => {
        if (!currSelectedEl) {
            return [];
        }

        return getSelector(currSelectedEl).pathArray;
    }, [currSelectedEl], isPauseSelected, []);

    // 实现鼠标移动选中元素
    useWindowEventListener('mousemove', useCallback(throttle((e) => {
        if (getIsPauseSelected()) {
            return;
        }

        let targetEl = document.elementFromPoint(e.clientX, e.clientY);

        if (!targetEl) {
            return;
        }

        while (!(targetEl instanceof HTMLElement)) {
            if (!targetEl) {
                return;
            }

            targetEl = targetEl.parentNode as Element;
        }

        setCurrSelectedEl(targetEl);
    }, 100), []));

    // 实现点击暂停监听
    useWindowEventListener('click', useCallback((e) => {
        if (!getIsPauseSelected()) {
            e.stopPropagation();
            e.preventDefault();
        }

        setIsPauseSelected(true);
    }, []), true);

    // ======================
    // ==== Dialog Body =====
    // ======================
    const selectorDisplayerRef = useRef<CornSelectorDisplayerRef>();

    const onSubmitBtnClick: OnBtnClickFnTYpe =  useCallback(() => {
        if (!selectorDisplayerRef.current) {
            console.log("spyxx 出错, selectorDisplayerRef.current 竟然为 null, 不可能存在这种离谱的情况")
            return;
        }

        props.onResult?.(selectorDisplayerRef.current.getSelector());

        props.onIsShowDialogChange?.(false);
    }, []);


    const onCurrElChange = useCallback((el: HTMLElement) => {
        if (isPauseSelected) {
            setCurrSelectedEl(el);
        }
    }, [isPauseSelected]);

    let _DialogBody = (
        <>
            <CornSelectorDisplayer
                ref={selectorDisplayerRef}
                currSelectorArr={currSelectorArr}
                onCurrElChange={onCurrElChange}
            />

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

            <CornButton data-slot="submit-btn" onClick={onSubmitBtnClick}>
                提交
            </CornButton>
        </>
    )

    // =================
    // ==== Dialog =====
    // =================

    const {bodyRef, containerRef} = useDraggableContainer();

    return (
        <UserSelectDialogWrapper
            className={clsx("", props.className)}

            data-slot="user-select-dialog"
        >
            <CornDialog ref={containerRef}>
                <CornDialogContent>
                    <CornDialogHeader>
                        {propTitle}
                    </CornDialogHeader>

                    <CornDialogBody className="flex flex-col gap-3 p-2" ref={bodyRef}>
                        {_DialogBody}
                    </CornDialogBody>
                </CornDialogContent>
            </CornDialog>
        </UserSelectDialogWrapper>
    );
});


export default UserSelectDialog;
