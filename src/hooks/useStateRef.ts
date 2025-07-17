import {useEffect, useRef, useState} from "react";


export function useStateRef<T>(initValue: T): [T, React.Dispatch<React.SetStateAction<T>>, React.MutableRefObject<T>] {
    const [value, setValue] = useState<T>(initValue);

    const ref = useRef(initValue);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return [value, setValue, ref];
}
