// src/eventBus/ParamOptionContext.ts

import {createContext} from "react";
import {ISpyXXGetSelectorOptionsType} from "@/types/global";

export const ParamOptionContext = createContext<ISpyXXGetSelectorOptionsType>({});

export default ParamOptionContext;
