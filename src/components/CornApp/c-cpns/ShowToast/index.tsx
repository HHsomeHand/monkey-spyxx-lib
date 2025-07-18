// src/components/CornApp/c-cpns/ShowToast/index.tsx

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {memo} from "react";
import {ShowToastWrapper} from "./style.ts";
import {clsx} from "clsx";
import {ShowToastOptions} from "@/types/eventBus.ts";
import cornMitt from "@/eventBus";
import {CSSTransition} from "react-transition-group";

interface ShowToastProps {
    className?: string,
}

export const ShowToast = memo((
    props:  ShowToastProps
) => {
    const [toastMsg, setToastMsg] = useState("");

    const [isShowToast, setIsShowToast] = useState(false);

    const durationRef = useRef(300);

    useEffect(() => {
        if (toastMsg !== "") {
            const id = setTimeout(() => {
                setIsShowToast(false);
            }, durationRef.current);

            return () => {
                clearTimeout(id);
            }
        }
    }, [toastMsg]);

    useEffect(() => {
        function showToast({msg, duration = durationRef.current}: ShowToastOptions) {
            setToastMsg(msg);
            setIsShowToast(true);
            durationRef.current = duration;
        }

        cornMitt.on('showToast', showToast);

        return () => {
            cornMitt.off('showToast', showToast);
        }
    }, []);

    const toastRef = useRef<HTMLDivElement>(null);

    return (
        <ShowToastWrapper
            className={clsx("", props.className)}
            data-slot="show-toast"
        >
            <CSSTransition
                nodeRef={toastRef}
                in={isShowToast} // 控制动画触发
                timeout={300} // 动画持续时间（毫秒）
                classNames="corn-app__toast" // 动画类名前缀
                unmountOnExit // 退出时卸载组件
                appear={true}
            >
                <div ref={toastRef} className="bg-amber-400 p-3 fixed corn-center z-9999">{toastMsg}</div>
            </CSSTransition>
        </ShowToastWrapper>
    );
});

export default ShowToast;
