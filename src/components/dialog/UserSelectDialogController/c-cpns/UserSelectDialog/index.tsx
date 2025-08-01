// src/components/dialog/UserSelectDialog/index.tsx

import React, {memo, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {clsx} from "clsx";
import {CornDialog, CornDialogBody, CornDialogContent, CornDialogHeader} from "@/components/ui/dialog-base.tsx";
import {getSelector} from "@/utils/getSelector.ts";
import useWindowEventListener from "@/hooks/useWindowEventListener.ts";
import {CornButton, OnBtnClickFnTYpe} from "@/components/ui/button-base.tsx";
import {throttle} from "lodash";
import {useStateRef} from "@/hooks/useStateRef.ts";
import useCommittedRef from "@/hooks/useCommittedRef.ts";
import useMemoRef from "@/hooks/useMemoRef.ts";
import CornSelectorDisplayer, {
    SpyxxSelectorDisplayerRef
} from "./c-cpns/CornSelectorDisplayer";
import mergeRefs from "@/utils/mergeRefs.ts";
import cornMitt from "@/eventBus";
import ParamOptionContext from "@/context/ParamOptionContext.ts";
import { CSSTransition } from 'react-transition-group';
import SpyxxUserSelectDialogAnimation from "@/components/dialog/UserSelectDialogController/c-cpns/UserSelectDialog/style.ts";
import {useDraggableContainer} from "@/hooks/useDraggableContainer.ts";
import {elmGetter} from "@/utils/elmGetter.ts";

export interface SpyxxUserSelectDialogProps {
    onResult?: (selector: string) => void;
    isShowDialog: boolean;
    onIsShowDialogChange?: (newIsShowDialog: boolean) => void;
}

export function SpyxxUserSelectDialog(
    props:  SpyxxUserSelectDialogProps
) {
    return (
        <SpyxxUserSelectDialogAnimation>
            <SpyxxUserSelectDialogWithoutAnimation {...props}/>
        </SpyxxUserSelectDialogAnimation>
    )
}

export function SpyxxUserSelectDialogWithoutAnimation(
    props:  SpyxxUserSelectDialogProps
) {
    let {
        title: contextTitle = "请将光标放在目标元素上",
    } = useContext(ParamOptionContext);

    // =================
    // ==== Dialog =====
    // =================

    const {draggableRef, innerRef} = useDraggableContainer();
    return (
        //  react-transition-group 不兼容 React19
        //  https://github.com/reactjs/react-transition-group/issues/918
        <CSSTransition
            nodeRef={draggableRef}
            in={props.isShowDialog} // 控制动画触发
            timeout={300} // 动画持续时间（毫秒）
            classNames="dialog" // 动画类名前缀
            unmountOnExit // 退出时卸载组件
            appear={true}
        >
            <CornDialog ref={draggableRef}>
                <CornDialogContent>
                    <CornDialogHeader>
                        {contextTitle}
                    </CornDialogHeader>

                    <CornDialogBody className="flex flex-col gap-3 p-2 relative" ref={innerRef}>
                        <DialogBody {...props}/>
                    </CornDialogBody>
                </CornDialogContent>


                <a
                    className="text-xs text-neutral-600! opacity-55 whitespace-nowrap block w-full text-center py-0.5"
                    href="https://bbs.tampermonkey.net.cn/"
                    target="_blank"
                >
                    油猴中文网: https://bbs.tampermonkey.net.cn/
                </a>
            </CornDialog>
        </CSSTransition>
    );
}

function DialogBody(
    props:  SpyxxUserSelectDialogProps
) {
    let {
        title: contextTitle = "请将光标放在目标元素上",
        description: contextDescription = "",
        initPauseState: contextInitPauseState = false, // 默认不暂停
        initSelector: contextInitSelector = "",
        isShowPauseState: contextIsShowPauseState = true, // 默认显示是否暂停
        isShowInductor: contextIsShowInductor = true, // 默认显示感应器
        onCurrSelectElChange: contextOnCurrSelectChange = undefined,
        submitBtnText: contextSubmitBtnText = "提交",
        excludeSelectors: contextExcludeSelectors = [],
        matchExcludeFn: contextMatchExcludeFn = undefined,
        cancelBtnText: contextCancelBtnText = "取消",
        isShowCancelBtn: contextIsShowCancelBtn = true,
        isFilterInvalidClassOrIdName: contextIsFilterInvalidClassOrIdName = false
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

    // getCurrSelectedEl 是给 useCallback 内部使用的 getter
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
        async function processInitSelector() {
            if (contextInitSelector === "") {
                return ;
            }

            const el = await elmGetter.get(contextInitSelector);

            if (!el) {
                console.log("spyxx: 传入的 initSelector 无效");

                return;
            }

            setCurrSelectedEl(el as HTMLElement);
        }

        processInitSelector()
    }, []);

    // >>>>>>>>>>>>>>>
    // == telescope
    // ==============
    const telescopeElRef = useRef<HTMLDivElement>();

    // 创建 telescopeElRef
    useEffect(() => {
        telescopeElRef.current = document.createElement('div');

        telescopeElRef.current.className = "bg-blue-300 opacity-25 fixed transition-all z-99 pointer-events-none"

        document.querySelector('.corn-app-shadow-host')?.shadowRoot?.appendChild(telescopeElRef.current);

        return () => {
            telescopeElRef.current?.remove();
        }
    }, []);

    // 实现小方块的圆角大小的保存和恢复
    useEffect(() => {
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
    // ==============
    // == End telescope
    // <<<<<<<<<<<<<<<

    const [isPauseSelected, setIsPauseSelected, getIsPauseSelected] = useStateRef(contextInitPauseState);

    useEffect(() => {
        cornMitt.emit('showToast', {
            msg: isPauseSelected ? "光标选择元素暂停" : "光标选择元素开始",
        })
    }, [isPauseSelected]);

    const [currSelectorArr, setCurrSelectorArr] = useState<string[]>([]);

    useEffect(() => {
        // 暂停选择了, 就不修改 currSelectorArr
        if ((currSelectorArr.length > 0) && isPauseSelected) {
            return;
        }

        if (!currSelectedEl) {
            setCurrSelectorArr([]);
            return;
        }

        const l_currSelectorArr = getSelector(
            currSelectedEl,
            matchExcludeFn,
            contextIsFilterInvalidClassOrIdName
        ).pathArray;

        setCurrSelectorArr(l_currSelectorArr);
    }, [currSelectedEl]);

    // 实现鼠标移动选中元素
    useWindowEventListener('mousemove', useCallback(throttle((e: MouseEvent) => {
        if (getIsPauseSelected()) {
            return;
        }

        let targetPathArr = e.composedPath();

        let target = targetPathArr[0];

        if (!target || !(target instanceof Element)) {
            return;
        }

        let targetEl: Element = target;

        // 去除 svg path 等清空
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
    const selectorDisplayerRef = useRef<SpyxxSelectorDisplayerRef>();

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


    return (
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
        </>
    )
}

// @ts-ignore
export default SpyxxUserSelectDialog;
