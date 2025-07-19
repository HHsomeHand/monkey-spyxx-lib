// src/components/dialog/UserSelectDialog/index.tsx

import React, {memo, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
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
import mergeRefs from "@/utils/mergeRefs.ts";
import cornMitt from "@/eventBus";
import ParamOptionContext from "@/context/ParamOptionContext.ts";

export interface UserSelectDialogProps {
    className?: string,
    onResult?: (selector: string) => void;
    isShowDialog: boolean;
    onIsShowDialogChange?: (newIsShowDialog: boolean) => void;
    ref?: React.RefObject<HTMLDivElement>;
}

export const UserSelectDialog = memo((
    props:  UserSelectDialogProps
) => {
    let {
        title: contextTitle = "请将光标放在目标元素上",
        description: contextDescription = "",
        initPauseState: contextInitPauseState = false, // 默认不暂停
        initSelector: contextInitSelector = "",
        isShowPauseState: contextIsShowPauseState = true, // 默认显示是否暂停
        isShowInductor: contextIsShowInductor = true, // 默认显示感应器
        isUseShadow: contextIsUseShadow = false, // 默认使用方块标注
        onCurrSelectElChange: contextOnCurrSelectChange = undefined,
        submitBtnText: contextSubmitBtnText = "提交",
        excludeSelectors: contextExcludeSelectors = [],
        matchExcludeFn: contextMatchExcludeFn = undefined,
        cancelBtnText: contextCancelBtnText = "取消",
        isShowCancelBtn: contextIsShowCancelBtn = true,
    } = useContext(ParamOptionContext);

    function matchExcludeFn(el: HTMLElement) {
        for (const excludeSelector of contextExcludeSelectors) {
            if (el.matches(excludeSelector)) {
                return true;
            }
        }

        if (!contextMatchExcludeFn) {
            return false;
        }

        return contextMatchExcludeFn(el);
    }

    const [currSelectedEl, private_setCurrSelectedEl, getCurrSelectedEl] = useStateRef<HTMLElement | null>(null);

    // 对 private_setCurrSelectedEl 进行封装, 避免选到对话框上的元素
    function setCurrSelectedEl(el: HTMLElement) {
        if (currSelectedEl === el) {
            return;
        }

        if (el.matches(".corn-app *, .corn-app")) {
            return;
        }

        if (matchExcludeFn(el)) {
            return;
        }

        private_setCurrSelectedEl(el);
    }

    // 处理 contextInitSelector
    useEffect(() => {
        if (contextInitSelector === "") {
            return ;
        }

        const el = document.querySelector(contextInitSelector);

        if (!el) {
            console.log("spyxx: 传入的 initSelector 无效");

            return;
        }

        setCurrSelectedEl(el as HTMLElement);
    }, []);

    useEffect(() => {
        if (!contextOnCurrSelectChange) return;
        if (!currSelectedEl) return;

        return contextOnCurrSelectChange(currSelectedEl);
    }, [currSelectedEl]);

    // 保存选中元素的阴影样式, 方便选中下一个时, 恢复
    let preBoxShadowRef = useRef("");

    // 实现 shadowBox 的保存与恢复
    useEffect(() => {
        if (!contextIsUseShadow) return;

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
        if (!contextIsUseShadow) return;

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

    const telescopeElRef = useRef<HTMLDivElement>();

    // 创建 telescopeElRef
    useEffect(() => {
        if (contextIsUseShadow) return;

        telescopeElRef.current = document.createElement('div');

        telescopeElRef.current.className = "bg-blue-300 opacity-25 fixed transition-all z-99 pointer-events-none"

        document.querySelector('.corn-app')?.appendChild(telescopeElRef.current);

        return () => {
            telescopeElRef.current?.remove();
        }
    }, []);

    // 实现小方块的圆角大小的保存和恢复
    useEffect(() => {
        if (contextIsUseShadow) return;

        if (!currSelectedEl) return;


        const telescopeEl = telescopeElRef.current;

        if (!telescopeEl) return;

        const rect = currSelectedEl.getBoundingClientRect();

        telescopeEl.style.top = `${rect.top}px`;

        telescopeEl.style.left = `${rect.left}px`;

        telescopeEl.style.width = `${rect.width}px`;

        telescopeEl.style.height = `${rect.height}px`;

        const style = window.getComputedStyle(currSelectedEl);

        // 拷贝每个角的 border-radius
        telescopeEl.style.borderTopLeftRadius = style.borderTopLeftRadius;
        telescopeEl.style.borderTopRightRadius = style.borderTopRightRadius;
        telescopeEl.style.borderBottomRightRadius = style.borderBottomRightRadius;
        telescopeEl.style.borderBottomLeftRadius = style.borderBottomLeftRadius;
    }, [currSelectedEl]);

    useEffect(() => {
        if (!props.isShowDialog && telescopeElRef.current) {
            telescopeElRef.current.style.opacity = "0";
        }
    }, [props.isShowDialog]);

    const [isPauseSelected, setIsPauseSelected, getIsPauseSelected] = useStateRef(contextInitPauseState);

    useEffect(() => {
        cornMitt.emit('showToast', {
            msg: isPauseSelected ? "光标选择元素暂停" : "光标选择元素开始",
        })
    }, [isPauseSelected]);

    const [currSelectorArr, getCurrSelectorArr] = useMemoRef<string[]>(() => {
        if (!currSelectedEl) {
            return [];
        }

        return getSelector(currSelectedEl, matchExcludeFn).pathArray;
    }, [currSelectedEl], (arr) => (arr.length > 0) && isPauseSelected, []);

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

    const onFinishBtnClick = useCallback((result: string) => {
        // 等待过渡动画结束
        setTimeout(() => {
            props.onResult?.(result);
        }, 500);

        props.onIsShowDialogChange?.(false);
    }, [])

    const onSubmitBtnClick: OnBtnClickFnTYpe =  useCallback(() => {
        if (!selectorDisplayerRef.current) {
            console.log("spyxx 出错, selectorDisplayerRef.current 竟然为 null, 不可能存在这种离谱的情况")
            return;
        }

        onFinishBtnClick(selectorDisplayerRef.current.getSelector())
    }, []);

    const onCancelBtnClick: OnBtnClickFnTYpe =  useCallback(() => {
        onFinishBtnClick("")
    }, []);


    const onCurrElChange = useCallback((el: HTMLElement) => {
        if (isPauseSelected) {
            setCurrSelectedEl(el);
        }
    }, [isPauseSelected]);

    let _DialogBody = (
        <>
            {
                contextDescription !== "" && (
                    <p>{contextDescription}</p>
                )
            }

            <CornSelectorDisplayer
                ref={selectorDisplayerRef}
                currSelectorArr={currSelectorArr}
                onCurrElChange={onCurrElChange}
            />

            {
                contextIsShowPauseState && (
                    <p>
                        当前选择状态: {isPauseSelected ? "暂停" : "未暂停"}
                    </p>
                )
            }

            {
                contextIsShowInductor && (
                    <>
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
                    </>
                )
            }

            <div className="flex gap-2">

                {
                    contextIsShowCancelBtn && (
                        <CornButton className="grow bg-neutral-50!" data-slot="submit-btn" onClick={onCancelBtnClick}>
                            {contextCancelBtnText}
                        </CornButton>
                    )
                }

                <CornButton className="grow bg-neutral-50!" data-slot="submit-btn" onClick={onSubmitBtnClick}>
                    {contextSubmitBtnText}
                </CornButton>

            </div>




            <a
                className="text-xs text-neutral-600! opacity-55 whitespace-nowrap absolute bottom-[-27px] left-[50%] translate-x-[-50%]"
                href="https://bbs.tampermonkey.net.cn/"
                target="_blank"
            >
                油猴中文网: https://bbs.tampermonkey.net.cn/
            </a>

        </>
    )

    // =================
    // ==== Dialog =====
    // =================

    const {bodyRef, containerRef} = useDraggableContainer();

    useEffect(() => {

    }, []);
    return (
        <UserSelectDialogWrapper
            className={clsx("", props.className)}

            data-slot="user-select-dialog"
        >
            <CornDialog ref={mergeRefs(containerRef, props.ref)}>
                <CornDialogContent>
                    <CornDialogHeader>
                        {contextTitle}
                    </CornDialogHeader>

                    <CornDialogBody className="flex flex-col gap-3 p-2 relative" ref={bodyRef}>
                        {_DialogBody}
                    </CornDialogBody>
                </CornDialogContent>
            </CornDialog>
        </UserSelectDialogWrapper>
    );
});


// @ts-ignore
export default UserSelectDialog;
