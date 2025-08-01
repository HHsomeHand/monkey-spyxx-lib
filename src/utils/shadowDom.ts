// src/utils/shadowDom.ts

export function shadowDomQuerySelector(
    selector: string,
    parent: Element | Document
): Element | null {
    const selectors = selector
        .split('[[shadow-host]]')
        // 去掉这玩意: '   > '
        .map(selector => selector.replace(/^\s*>/, ''));

    let current: Element | Document | ShadowRoot | null = parent;

    for (let i = 0; i < selectors.length; i++) {
        const curSelector = selectors[i];

        current = (current as Element).querySelector(curSelector);

        if (!current) return null;

        if (i !== selectors.length - 1) {
            if (!hasShadowRoot(current)) {
                return null;
            }
        } else {
            return current;
        }

        current = current.shadowRoot;
    }

    return null;
}


export function shadowDomQuerySelectorAll(
    selector: string,
    parent: Element | Document
): Element[] {
    const selectors = selector
        .split('[[shadow-host]]')
        // 去掉这玩意: '   > '
        .map(selector => selector.replace(/^\s*>/, ''));

    let current: Element | Document | ShadowRoot | null = parent;

    for (let i = 0; i < selectors.length - 1; i++) {
        const curSelector = selectors[i];

        current = (current as Element).querySelector(curSelector);

        if (!current || !hasShadowRoot(current)) {
            return [];
        }

        current = current.shadowRoot;
    }

    const lastIndex = selectors.length - 1;
    const result = (current as Element).querySelectorAll(selectors[lastIndex]);

    // result 是伪数组, 得解开才能使用
    return [...result];
}

function hasShadowRoot(element: Element) {
    return element.shadowRoot !== null;
}

