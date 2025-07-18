import React from "react";
import ReactDOM from "react-dom/client";
import { cornDebugModeHint } from "@/assets/ascii-art/debug-mode-hint.ts";
import "@/assets/css/global.css";
import { CornApp } from "@/components/CornApp";
import UserSelectDialog from "@/components/dialog/UserSelectDialog";
import {UserSelectDialogController} from "@/components/dialog/UserSelectDialogController";
import {ISpyXX, SpyXXGetParentOptionsType, SpyXXGetSelectorOptionsType} from "@/types/global";

function renderDialog(dialog: React.ReactNode) {
    const app = document.createElement("div");
    document.body.append(app);

    ReactDOM.createRoot(
        app
    ).render(dialog);

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

            const clearFn = renderDialog(
                <CornApp paramOptions={options}>
                    <UserSelectDialogController onResult={onResult} />
                </CornApp>,
            );
        });
    },
    async getParent(selector: string, options: SpyXXGetParentOptionsType = {}) {
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
    testAdBlock();
}
