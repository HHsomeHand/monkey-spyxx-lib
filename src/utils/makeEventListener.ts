export type EventHandler<T, K extends keyof DocumentEventMap> = (
    this: T,
    ev: DocumentEventMap[K],
) => any;

export function makeEventListener<
    T extends Element | Document | Window,
    K extends keyof DocumentEventMap,
>(
    event: K,
    listener: EventHandler<T, K>,
    target: T = window as any,
    options: boolean | AddEventListenerOptions = false,
) {
    target.addEventListener(event, listener as any, options);

    return () => target.removeEventListener(event, listener as any, options);
}

export default makeEventListener;
