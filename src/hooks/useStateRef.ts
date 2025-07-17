import {useCallback, useEffect, useRef, useState} from "react";


export function useStateRef<T>(initValue: T): [T, React.Dispatch<React.SetStateAction<T>>, () => T] {
    const [value, setValue] = useState<T>(initValue);

    const ref = useRef(initValue);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    const getRefCurrent = useCallback(() => {
        return ref.current;
    }, []);

    return [value, setValue, getRefCurrent];
}
