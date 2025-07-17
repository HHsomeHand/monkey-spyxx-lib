import {DependencyList, useCallback, useEffect, useMemo, useRef} from "react";
import {getSelector} from "@/utils/getSelector.ts";

// 在 isUseRefCache 为 true 时, 使用 ref 保存的值
export function useMemoRef<T>(
    factory: () => T,
    deps: DependencyList,
    isUseRefCache: boolean,
    initValue: T
): [
    T,
    () => T,
]{
    const preValueRef = useRef<T>(initValue);

    const memo = useMemo<T>(() => {
        if (isUseRefCache) {
            return preValueRef.current;
        }

        return factory();
    }, deps);

    useEffect(() => {
        preValueRef.current = memo
    }, [memo])

    const getter = useCallback(() => {
        return preValueRef.current;
    }, []);

    return [memo, getter]
}

export default useMemoRef;
