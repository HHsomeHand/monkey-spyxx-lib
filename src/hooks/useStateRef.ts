import {useCallback, useEffect, useRef, useState} from "react";


export function useStateRef<T>(initValue: T): [T, React.Dispatch<React.SetStateAction<T>>, () => T] {
    const [value, setValue] = useState<T>(initValue);

    const ref = useRef(initValue);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    // 不直接返回 ref, 是因为要保证 ref 为只读
    // 如果返回 ref, 修改 ref, 无法修改 state, 会割裂
    const getRefCurrent = useCallback(() => {
        return ref.current;
    }, []);

    return [value, setValue, getRefCurrent];
}
