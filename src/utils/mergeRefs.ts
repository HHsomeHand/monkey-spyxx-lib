import {MutableRefObject, Ref} from "react";

/**
 * 合并多个 ref（支持回调和对象形式的 ref）
 */
export function mergeRefs<T>(...refs: (Ref<T> | undefined | null)[]): (instance: T | null) => void {
    return (node: T | null) => {
        for (const ref of refs) {
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref != null) {
                (ref as MutableRefObject<T | null>).current = node;
            }
        }
    };
}

export default mergeRefs;
