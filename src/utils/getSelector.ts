export function getSelector(
    element: Element,
    matchExcludeFn?: ((el: HTMLElement) => boolean),

    // 是否过滤掉不合法的 css class 或 id 名
    isFilterInvalidClassOrIdName = false
) {
    const path = [];
    let current: Element | null = element;

    while (current !== null && current !== document.documentElement) {
        if (matchExcludeFn && matchExcludeFn(current as HTMLElement)) {
            current = current.parentElement;
            continue;
        }

        let selector = current.tagName.toLowerCase();

        if (current.id) {
            if (isFilterInvalidClassOrIdName && !isValidCssId(current.id)) {
                // isFilterInvalidClassOrIdName 为 true 且 ID 不合法
            } else {
                // ID 选择器（即 #xxx）必须以字母或下划线开头
                selector += `#${CSS.escape(current.id)}`;
            }
        } else {
            let isHTMLElement = current instanceof HTMLElement;

            let isElHasClassName = false;

            // 只有 HtmlElement 才有类名, SVG 这种 Element 获取类名是一个 object, 行为不正常
            if (isHTMLElement && current.className) {
                let classesArr = String(current.className)
                    .split(' ')
                    .filter(c => c);

                if (isFilterInvalidClassOrIdName) {
                    classesArr = classesArr.filter(c => !isClassNameInvalid(c))
                } else {
                    classesArr = classesArr.map(c => CSS.escape(c));
                }

                let classesStr: string = classesArr.join('.');

                if (classesStr) {
                    selector += `.${classesStr}`;
                }

                isElHasClassName = true;
            }

            const siblings = Array.from(current.parentElement!.children);

            const sameElIndex = siblings.findIndex(
                sibling => {
                    let isSameTag = sibling.tagName === current!.tagName;

                    if (!isElHasClassName) {
                        // 没有类名的情况
                        return isSameTag;
                    }

                    let isSameClassName = hasSameClasses(sibling, current!);;

                    return isSameTag && isSameClassName;
                }
            );

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

            if (sameElIndex != -1) {
                const index = siblings.indexOf(current) + 1;

                if (index !== 1) {
                    // nth-child 是指这个 元素 是 父元素 的第几个子元素
                    // nth-child 的作用为指定 这个元素是父元素的第几个子元素, 而不是相同选择器的第几个元素
                    selector += `:nth-child(${index})`;
                }
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

function isValidCssId(id: string) {
    // CSS ID selector must not start with a digit or contain invalid characters
    // Must start with a letter, underscore (_), or hyphen (-), followed by letters, digits, underscores, or hyphens
    return /^[A-Za-z_\u00A0-\uFFFF][\w\-\u00A0-\uFFFF]*$/.test(id);
}

function isClassNameInvalid(className: string) {
    // CSS class names used in querySelector must not contain these unescaped characters
    const invalidCharsRegex = /[ !"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/;

    return invalidCharsRegex.test(className);
}
