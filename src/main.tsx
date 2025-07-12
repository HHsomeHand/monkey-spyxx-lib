import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "@/components/App";
import {cornDebugModeHint} from "@/assets/ascii-art/debug-mode-hint.ts";
import {ISpyXX} from "@/types";
import "@/assets/css/global.css";

const spyXX: ISpyXX = {
    async getSelector() {
        return "ccc";
    },
    async getParent(selector: string) {
        return "ccc";
    }
}

window.spyXX = spyXX;

ReactDOM.createRoot(
  (() => {
    const app = document.createElement('div');
    document.body.append(app);
    return app;
  })(),
).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
);

if (import.meta.env.MODE === 'development') {
    // 仅在开发环境运行的代码
    console.log(cornDebugModeHint);
}
