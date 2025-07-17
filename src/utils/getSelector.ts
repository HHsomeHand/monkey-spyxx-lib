export function getSelector(element: Element) {
    const path = [];
    let current: Element | null = element;

    while (current !== null && current !== document.documentElement) {
        let selector = current.tagName.toLowerCase();

        if (current.id) {
            path.unshift(`#${current.id}`);

            break;
        }

        let isElHasClassName = false;

        if (current.className) {
            const classes = String(current.className).split(' ').filter(c => c).join('.');

            if (classes) {
                selector += `.${classes}`;
            }

            isElHasClassName = true;
        }

        function hasSameClasses(element1: Element, element2: Element): boolean {
            // 将第一个元素的类名存入 Set
            const classes1 = new Set(element1.classList);

            // 将第二个元素的类名存入 Set
            const classes2 = new Set(element2.classList);

            // 检查两个 Set 的大小是否相同
            if (classes1.size !== classes2.size) {
                return false;
            }

            // 检查每个类名是否同时存在于两个 Set 中
            for (const className of classes1) {
                if (!classes2.has(className)) {
                    return false;
                }
            }

            return true;
        }

        const siblings = Array.from(current.parentElement!.children).filter(
            sibling => {
                let isSameTag = sibling.tagName === current!.tagName;

                let isSameClassName = true;

                if (isElHasClassName) {
                    isSameClassName = hasSameClasses(sibling, current!);
                }
                return isSameTag && isSameClassName;
            }
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
