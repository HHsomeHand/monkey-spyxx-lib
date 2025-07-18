import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { memo } from "react";
import { makeDraggable } from "@/utils/makeDraggable.ts";
import cornMitt from "@/eventBus";
import {ShowToastOptions} from "@/types/eventBus.ts";
import CornAppWrapper from "./style.ts";
import {CSSTransition} from "react-transition-group";
import UserSelectDialog from "@/components/dialog/UserSelectDialog";
import ShowToast from "./c-cpns/ShowToast";
import {SpyXXGetSelectorOptionsType} from "@/types/global";
import ParamOptionContext from "@/context/ParamOptionContext.ts";

interface CornAppProps {
    className?: string;
    children?: React.ReactNode;
    paramOptions: SpyXXGetSelectorOptionsType,
}

export const CornApp = memo((props: CornAppProps) => {
    return (
        <ParamOptionContext.Provider value={props.paramOptions}>
            <CornAppWrapper className={clsx(props.className, "corn-app")}>
                {props.children}

                <ShowToast/>
            </CornAppWrapper>
        </ParamOptionContext.Provider>
    );
});

export default CornApp;
