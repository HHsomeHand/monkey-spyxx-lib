import React from 'react';
import ReactDOM from 'react-dom/client';
import {cornDebugModeHint} from "@/assets/ascii-art/debug-mode-hint.ts";
import {ISpyXX} from "@/types";
import "@/assets/css/global.css";
import UserSelectDialog from "@/components/Dialogs/UserSelectDialog";
import {CornApp} from "@/components/CornApp";

function renderDialog(dialog: React.ReactNode) {
    return ReactDOM.createRoot(
        (() => {
            const app = document.createElement('div');
            document.body.append(app);
            return app;
        })(),
    ).render(
        dialog
    );
}

const spyXX: ISpyXX = {
    async getSelector() {
        return new Promise((resolve) => {
            function onResult(result: string) {
                resolve(result);
            }

            renderDialog(
                <CornApp>
                    <UserSelectDialog onResult={onResult}/>
                </CornApp>
            );
        });
    },
    async getParent(selector: string) {
        return "ccc";
    }
}

window.spyXX = spyXX;


if (import.meta.env.MODE === 'development') {
    // 仅在开发环境运行的代码
    console.log(cornDebugModeHint);

    async function main() {
        let result = await window.spyXX.getSelector();

        console.log(result);
    }

    main();
}
