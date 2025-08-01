// src/utils/shadowDom.ts


export function shadowDomQuerySelector(
    selector: string,
    parent: Element | Document
): Element | null {
    const selectors = selector.split('[[shadow-host]]');

    const el = parent.querySelector(selectors[0]);

    if (!el || !hasShadowRoot(el)) {
        return el;
    }

    if (selectors.length !== 1) {
        let shadowRoot = el.shadowRoot;

        for (let i = 1; i < selectors.length; i++) {
            let currSelector = selectors[i];

            // 去掉这玩意: '   > '
            currSelector = currSelector.replace(/^\s*>/, '');
            let shadowHost = (shadowRoot as ShadowRoot).querySelector(currSelector);

            console.log(currSelector, shadowHost);
            if (!shadowHost || !hasShadowRoot(shadowHost)) {
                return shadowHost;
            } else {
                shadowRoot = shadowHost.shadowRoot;
            }
        }
    }

    return el;
}

function hasShadowRoot(element: Element) {
    return element.shadowRoot !== null;
}

