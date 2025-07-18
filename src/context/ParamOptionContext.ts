// src/eventBus/ParamOptionContext.ts

import {createContext} from "react";
import {SpyXXGetSelectorOptionsType} from "@/types/global";

export const ParamOptionContext = createContext<SpyXXGetSelectorOptionsType>({});

export default ParamOptionContext;
