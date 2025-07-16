export function getSelector(element: Element) {
    const path = [];
    let current: Element | null = element;

    while (current !== null && current !== document.documentElement) {
        let selector = current.tagName.toLowerCase();

        if (current.id) {
            path.unshift(`#${current.id}`);
            break;
        }

        if (current.className) {
            const classes = String(current.className).split(' ').filter(c => c).join('.');

            if (classes) {
                selector += `.${classes}`;
            }
        }

        const siblings = Array.from(current.parentElement!.children).filter(
            sibling => sibling.tagName === current!.tagName
        );

        if (siblings.length > 1) {
            const index = siblings.indexOf(current) + 1;

            if (index !== 1) {
                selector += `:nth-child(${index})`;
            }
        }

        path.unshift(selector);
        current = current.parentElement;
    }
    return {
        selector: path.join(' > '),
        pathArray: path,
    }
}
