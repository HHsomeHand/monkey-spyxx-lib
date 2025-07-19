import React from "react";
import ReactDOM from "react-dom/client";
import { cornDebugModeHint } from "@/assets/ascii-art/debug-mode-hint.ts";
import globalCSSContent from "@/assets/css/global.css?inline";
import { CornApp } from "@/components/CornApp";
import UserSelectDialog from "@/components/dialog/UserSelectDialog";
import {UserSelectDialogController} from "@/components/dialog/UserSelectDialogController";
import {ISpyXX, SpyXXGetParentOptionsType, SpyXXGetSelectorOptionsType} from "@/types/global";
import { StyleSheetManager } from "styled-components";

function renderDialog(dialogFactory: (shadowRoot: ShadowRoot) => React.ReactNode) {
    // 创建一个容器元素
    const app = document.createElement("div");
    app.className = "corn-app-shadow-host";
    document.body.append(app);

    // 创建 Shadow Root
    const shadowRoot = app.attachShadow({ mode: "open" });

    // 创建挂载点供 React 渲染（挂到 shadow DOM 中）
    const mountPoint = document.createElement("div");
    shadowRoot.appendChild(mountPoint);

    const styleEl = document.createElement("style");
    styleEl.textContent = globalCSSContent;
    shadowRoot.appendChild(styleEl);

    // React 渲染到 shadow DOM 中的 mountPoint
    ReactDOM.createRoot(mountPoint).render(dialogFactory(shadowRoot));

    // 返回销毁函数
    return () => {
        app.remove();
    };
}

const spyXX: ISpyXX = {
    async getSelector(options: SpyXXGetSelectorOptionsType = {}) {
        return new Promise((resolve) => {
            function onResult(result: string) {
                clearFn();

                resolve(result);
            }

            /*
                styled-components 在 shadowDOM 内, 无法正常工作.

                styled-components 是直接把 css 注入到 document 内.

                而如果 react组件 在 shadowDOM 中, 会直接导致 styled-components 注入的 css 无效.

                通过 StyleSheetManager 指定挂载点
             */
            const clearFn = renderDialog((shadowRoot) => {
                return (
                    <StyleSheetManager target={shadowRoot}>
                        <CornApp paramOptions={options}>
                            <UserSelectDialogController onResult={onResult} />
                        </CornApp>
                    </StyleSheetManager>
                )
            });
        });
    },
    async getParent(selector: string, options: SpyXXGetParentOptionsType = {}) {
        if (selector === "") {
            console.warn("spyxx getParent selector 为空字符串, 请检查后再调用本函数")

            return "";
        }

        return this.getSelector({
            isShowPauseState: false,
            initPauseState: true,
            isShowInductor: false,
            initSelector: selector,
            ...options
        });
    },
};

window.spyXX = spyXX;

if (import.meta.env.MODE === "development") {
    // 仅在开发环境运行的代码
    console.log(cornDebugModeHint);

    async function testSelectToLog(): Promise<string> {
        let selector = await window.spyXX.getSelector();

        if (!selector) {
            console.log("用户取消了选择");
            return new Promise<string>((resolve) => {});
        }

        console.log(selector);

        return selector;
    }

    async function testSelectToRemove() {
        const selector = await testSelectToLog();

        let resultEl = document.querySelector(selector);

        if (!resultEl) {
            console.log("选择器错误, 可能是 spyXX bug, 请联系 qq2402398917 反馈错误, 谢谢")
            return;
        }

        resultEl.remove();
    }

    async function testSelectParent() {
        const selector = "body > div.L3eUgb > div.o3j99.n1xJcf.Ne6nSd > div.LX3sZb > div > div > header#gb > div#gbwa > div.gb_D > a.gb_B";

        const parentSelector = await window.spyXX.getParent(selector);

        console.log(parentSelector);

        console.log(document.querySelector(parentSelector));
    }

    async function testAdBlock() {
        const selector = await window.spyXX.getSelector({
            excludeSelectors: ["body"],
        });

        let targetSelector = await window.spyXX.getParent(selector, {
            excludeSelectors: ["body"],
            title: "现在看起来怎么样?",
            submitBtnText: "看起来不错",
            onCurrSelectElChange(el) {
                el.style.visibility = "hidden";

                return () => {
                    el.style.visibility = "";
                }
            }
        });

        let resultEl = document.querySelector(targetSelector);

        if (!resultEl) {
            console.log("选择器错误, 可能是 spyXX bug, 请联系 qq2402398917 反馈错误, 谢谢")
            return;
        }

        resultEl.remove();
    }

    async function testAdBlockAndExcludeFn() {
        function matchExcludeFn(el: HTMLElement) {
            return el.matches('body');
        }

        const selector = await window.spyXX.getSelector({
            matchExcludeFn
        });

        let targetSelector = await window.spyXX.getParent(selector, {
            matchExcludeFn,
            title: "现在看起来怎么样?",
            submitBtnText: "看起来不错",
            onCurrSelectElChange(el) {
                el.style.visibility = "hidden";

                return () => {
                    el.style.visibility = "";
                }
            }
        });

        let resultEl = document.querySelector(targetSelector);

        if (!resultEl) {
            console.log("选择器错误, 可能是 spyXX bug, 请联系 qq2402398917 反馈错误, 谢谢")
            return;
        }

        resultEl.remove();
    }

    async function testAdBlockStep() {
        let l_currStep = 0;

        let l_selector = "";

        let l_isEnd = false;

        while (true) {
            switch (l_currStep) {
                // 选择要删除的元素
                case 0: {
                    l_selector = await window.spyXX.getSelector({
                        excludeSelectors: ["body"],
                    });

                    if (l_selector !== "") {
                        l_currStep++;
                    } else {
                        showToast("用户取消了选择");
                        l_isEnd = true;
                    }

                    break;
                }
                case 1: {
                    let targetSelector = await window.spyXX.getParent(l_selector, {
                        excludeSelectors: ["body"],
                        title: "现在看起来怎么样?",
                        submitBtnText: "看起来不错",
                        cancelBtnText: "上一步",
                        onCurrSelectElChange(el) {
                            el.style.visibility = "hidden";

                            return () => {
                                el.style.visibility = "";
                            }
                        }
                    });

                    if (targetSelector === "") {
                        l_currStep--;
                        break;
                    }

                    let resultEl = document.querySelector(targetSelector);

                    if (!resultEl) {
                        console.log("选择器错误, 可能是 spyXX bug, 请联系 qq2402398917 反馈错误, 谢谢")
                        break;
                    }

                    resultEl.remove();

                    l_isEnd = true;
                }
            }

            if (l_isEnd) {
                break;
            }
        }

        showToast("结束!");

        function showToast(message: string) {
            // @ts-ignore
            let toast = document.body.toast;

            if (toast === undefined) {
                toast = document.createElement('div');
                toast.style.position = 'fixed';
                toast.style.bottom = '55vh';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.padding = '10px 20px';
                toast.style.backgroundColor = '#333';
                toast.style.color = '#fff';
                toast.style.borderRadius = '5px';
                toast.style.fontSize = '14px';
                toast.style.zIndex = '9999';
                toast.style.opacity = '0';
                toast.style.transition = 'all 0.5s ease';
                toast.style.visibility = 'hidden';
                document.body.appendChild(toast);
                // @ts-ignore
                document.body.toast = toast;
            }
            toast.innerText = message;

            // 显示 toast
            toast.style.opacity = '1';
            toast.style.visibility = 'visible';

            // 3秒后隐藏
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.visibility = 'hidden';
            }, 3000);
        }
    }

    testAdBlockStep();
}
