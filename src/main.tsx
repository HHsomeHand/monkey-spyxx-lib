import React from "react";
import ReactDOM from "react-dom/client";
import { cornDebugModeHint } from "@/assets/ascii-art/debug-mode-hint.ts";
import "@/assets/css/global.css";
import { CornApp } from "@/components/CornApp";
import UserSelectDialog from "@/components/dialog/UserSelectDialog";
import {UserSelectDialogController} from "@/components/dialog/UserSelectDialogController.tsx";
import {ISpyXX} from "@/types/global";

function renderDialog(dialog: React.ReactNode) {
    return ReactDOM.createRoot(
        (() => {
            const app = document.createElement("div");
            document.body.append(app);
            return app;
        })(),
    ).render(dialog);
}

const spyXX: ISpyXX = {
    async getSelector() {
        return new Promise((resolve) => {
            function onResult(result: string) {
                resolve(result);
            }

            renderDialog(
                <CornApp>
                    <UserSelectDialogController title="请将光标放在目标元素上:" onResult={onResult} />
                </CornApp>,
            );
        });
    },
    async getParent(selector: string) {
        return "ccc";
    },
};

window.spyXX = spyXX;

if (import.meta.env.MODE === "development") {
    // 仅在开发环境运行的代码
    console.log(cornDebugModeHint);

    async function main() {
        let selector = await window.spyXX.getSelector();

        if (!selector) {
            console.log("用户取消了选择");
            return;
        }

        let resultEl = document.querySelector(selector);

        if (!resultEl) {
            console.log("选择器错误, 可能是 spyXX bug, 请联系 qq2402398917 反馈错误, 谢谢")
            return;
        }

        resultEl.remove();
    }

    main();
}
