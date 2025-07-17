import {useCallback, useEffect, useRef} from 'react'


export function useCommittedRef<T>(
    value: T,
): () => T {
    const ref = useRef(value)

    useEffect(() => {
        ref.current = value
    }, [value])

    const getRefCurrent = useCallback(() => {
        return ref.current;
    }, []);

    return getRefCurrent;
}

export default useCommittedRef
