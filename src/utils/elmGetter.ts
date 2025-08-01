// src/utils/elmGetter.ts

// ==UserScript==
// @name         ElementGetter corn.fork.ver
// @author       cxxjackie, hzx
// @version      3.0.2 - spyxx fork
// ==/UserScript==
import {CSSElmGetterType, IElmGetter, IGetOptions, ModeType, ResultType} from "@/types/elmGetter";
import {shadowDomQuerySelector} from "@/utils/shadowDom.ts";

type WindowType = typeof window;

// windows 的 MutationObserver, 可以用来 new MutationObserver
type MutationObserverType = typeof MutationObserver;

// new 出来的 MutationObserver 类型
type NewMutationObserverType = MutationObserver & {
    canceled: boolean
};

type FilterReasonType = 'attr' | 'insert';

// 过滤器是一个函数
type FilterType = (el: Node, reason: FilterReasonType) => void;

type QueryResultType = Element | JQuery<Element> | Node | null;

type QueryAllResultType  = Element[] | JQuery<Element>[] | Node[];

// listener 是一个对象
interface ListenerType {
    // 删除 MutationObserver
    remove: () => void;

    // 每次 MutationObserver 检测到 mutation, listener 就调用一遍 filters
    filters: Set<FilterType>;
}

export const elmGetter = function () {
    // @ts-ignore
    const win: WindowType = window.unsafeWindow || document.defaultView || window;

    const doc = win.document;
    const listeners = new WeakMap<Node, ListenerType>();
    let mode: ModeType = 'css';
    let $: JQueryStatic;
    const elProto = win.Element.prototype;

    // @ts-ignore
    const matches: Element.matches = elProto.matches || elProto.matchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;

    // @ts-ignore
    const MutationObs: MutationObserverType = win.MutationObserver || win.WebkitMutationObserver || win.MozMutationObserver;

    function createObserver(target: Node, callback: FilterType) {
        const observer = new MutationObs(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    callback(mutation.target, 'attr');
                    if (observer.canceled) return;
                }
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) callback(node, 'insert');
                    if (observer.canceled) return;
                }
            }
        }) as NewMutationObserverType;

        observer.canceled = false;

        observer.observe(target, {childList: true, subtree: true, attributes: true, attributeOldValue: true});

        return () => {
            observer.canceled = true;
            observer.disconnect();
        };
    }

    function addFilter(target: Node, filter: FilterType) {
        let listener = listeners.get(target);

        if (!listener) {
            listener = {
                filters: new Set(),
                remove: createObserver(
                    target,
                    (el, reason) => {
                        (listener as ListenerType).filters.forEach(f => f(el, reason))
                    }
                ) // END of remove: createObserver(
            }; // END of listener = {
            listeners.set(target, listener);
        }

        listener.filters.add(filter);
    }

    function removeFilter(target: Node, filter: FilterType) {
        const listener = listeners.get(target);

        if (!listener) return;

        listener.filters.delete(filter);

        if (!listener.filters.size) {
            listener.remove();
            listeners.delete(target);
        }
    }

    interface IQuery {
        curMode: ModeType;
        reason?: FilterReasonType;
        root: Node;
        parent: Node;
    }
    function query(selector: string, options: IQuery): QueryResultType {
        const {
            curMode: paramCurMode,
            reason: paramReason,
            root: paramRoot,
            parent: paramParent,
        } = options;

        if (!(paramParent instanceof Element) && !(paramParent instanceof Document)) return null;

        switch (paramCurMode) {
            case 'css': {
                return shadowDomQuerySelector(selector, paramParent);
            }
            case 'jquery': {
                if (paramReason === 'attr') {
                    return $(paramParent).is(selector) ? $(paramParent as any) : null;
                }

                const jNodes: any = $(paramParent !== paramRoot ? paramParent : [])
                    .add([...paramParent.querySelectorAll('*')]).filter(selector);

                return jNodes.length ? $(jNodes.get(0)) : null;
            }
            case 'xpath': {
                const ownerDoc = paramParent.ownerDocument || paramParent;

                selector += '/self::*';

                return ownerDoc.evaluate(
                    selector,
                    paramReason === 'attr' ? paramRoot : paramParent,
                    null,
                    9,
                    null
                ).singleNodeValue;
            }
        } // END of  switch (paramCurMode) {
    }

    function queryAll(selector: string, options: IQuery): QueryAllResultType {
        const {
            curMode: paramCurMode,
            reason: paramReason,
            root: paramRoot,
            parent: paramParent,
        } = options;

        if (!(paramParent instanceof Element) && !(paramParent instanceof Document)) return [];

        switch (paramCurMode) {
            case 'css': {
                if (paramReason === 'attr') return matches.call(paramParent, selector) ? [paramParent] : [];
                const checkParent = paramParent !== paramRoot && matches.call(paramParent, selector);
                const result = paramParent.querySelectorAll(selector);
                return checkParent ? [paramParent, ...result] : [...result];
            }
            case 'jquery': {
                if (paramReason === 'attr') return $(paramParent).is(selector) ? [$(paramParent as any)] : [];
                const jNodes = $(paramParent !== paramRoot ? paramParent : []).add([...paramParent.querySelectorAll('*')]).filter(selector);
                return $.map(jNodes, el => $(el as any));
            }
            case 'xpath': {
                const ownerDoc = paramParent.ownerDocument || paramParent;
                selector += '/self::*';
                const xPathResult = ownerDoc.evaluate(selector, paramReason === 'attr' ? paramRoot : paramParent, null, 7, null);
                const result: Node[] = [];
                for (let i = 0; i < xPathResult.snapshotLength; i++) {
                    let node =xPathResult.snapshotItem(i);

                    if (!node) {
                        continue;
                    }

                    result.push(node);
                }
                return result;
            }
        }
    }

    function isJquery(jq: JQueryStatic) {
        return jq && jq.fn && typeof jq.fn.jquery === 'string';
    }

    // get 已经帮我们设置了 options 的默认值, 所以我们可以放心用 Required
    interface IGetOne extends Required<IGetOptions> {
        parent: Element | Document;
    }

    function getOne(selector: string, options: IGetOne): Promise<ResultType> {
        const {
            parent: paramParent,
            onError: paramOnError,
            timeout: paramTimeout,
            isPending: paramIsPending,
            errEl: paramErrEl,
        } = options;

        const localCurMode = mode;

        return new Promise(resolve => {
            const localNode = query(
                selector,
                {
                    parent: paramParent,
                    root: paramParent,
                    curMode: localCurMode
                }
            );

            if (localNode) return resolve(localNode);
            let localTimerId: number;

            const localFilter: FilterType = (
                filterParamEl: Node,
                filterParamReason: FilterReasonType
            ) => {
                const localNode = query(
                    selector,
                    {
                        parent: filterParamEl,
                        root: paramParent,
                        curMode: localCurMode,
                        reason: filterParamReason
                    }
                );

                if (localNode) {
                    removeFilter(paramParent, localFilter);
                    localTimerId && clearTimeout(localTimerId);
                    resolve(localNode);
                }
            }; // END of const p_filter = (el, reason) => {

            addFilter(paramParent, localFilter);

            if (paramTimeout > 0) {
                localTimerId = win.setTimeout(() => {
                    removeFilter(paramParent, localFilter);

                    paramOnError(selector);

                    if (!paramIsPending) {
                        resolve(errEl);
                    }
                }, paramTimeout);
            } // END of if (paramTimeout > 0) {
        }); // END of return new Promise(resolve => {
    } // END of  function getOne(selector: string, options: IGetOne) {

    let errEl = document.createElement('div');
    errEl.classList.add('no-found');
    errEl.remove = () => {};

    return {
        timeout: 0,
        onError:  (selector) => {console.warn(`[elmGetter] [get失败] selector为: ${selector} 的查询超时`)},
        isPending: true,
        errEl,
        get currentSelector() {
            return mode;
        },
        /**
         * 异步的 querySelector
         * @param selectorOrSelectors 选择器, 可以为数组
         * @param options 一个对象
         *  - parent 父元素, 默认值是 document
         *  - timeout 设置 get 的超时时间, 默认值是 elmGetter.timeout, 其值默认为 0
         *      - 如果该值为 0, 表示永不超时, 如果 selector 有误, 返回的 Promise 将永远 pending
         *      - 如果该值不为 0, 表示等待多少毫秒, 和 setTimeout 单位一致
         *  - onError 超时后的失败回调, 参数为 selector, 默认值为 elmGetter.onError, 其默认行为是 console.warn 打印 selector
         *  - isPending 超时后 Promise 是否仍然保持 pending, 默认值为 elmGetter.isPending, 其值默认为 true
         *  - errEl 超时后 Promise 返回的值, 需要 isPending 为 false 才能有效, 默认值为 elmGetter.errorEl,
         *      其值默认为一个 "class 为 no-found" "remove 为 () => {}" 的元素
         * @return 根据参数决定返回值
         * isPending 为 true
         *  如果 selector 为 字符串数组, 则返回 Promise<Element[]>
         *  如果 selector 为 字符串, 则返回 Promise<Element>
         *
         * isPending 为 false
         *  如果 selector 为 字符串数组, 则返回 Promise<Element[] | typeof errEl>
         *  如果 selector 为 字符串, 则返回 Promise<Element | typeof errEl>
         */
        get(selectorOrSelectors: string | string[], options: IGetOptions = {}): Promise<ResultType> | Promise<ResultType[]> {
            const localOptions: Required<IGetOptions> = {
                // 设置默认值
                parent: doc,
                timeout: this.timeout,
                onError: this.onError,
                isPending: this.isPending,
                errEl: this.errEl,

                // 利用参数覆盖默认值
                ...options,
            };

            if (mode === 'jquery' && localOptions.parent instanceof $) {
                localOptions.parent = (localOptions.parent as JQuery).get(0) ?? doc;
            }

            // 经过上面的处理, l_options.parent 一定会是 Element | Document, 所以 IGetOne 是安全的
            if (Array.isArray(selectorOrSelectors)) {
                let selectors = selectorOrSelectors;
                return Promise.all(selectors.map(s => getOne(s, localOptions as IGetOne)));
            }

            let selector = selectorOrSelectors;
            return getOne(selector, localOptions as IGetOne);
        },


        /**
         * 设置监听，所有符合选择器的元素（包括页面已有的和新插入的）都将被传给回调函数处理，
         * each方法适用于各种 滚动加载的列表（如评论区），或者发生 非刷新跳转的页面 (SPA)等
         *
         * @param selector 选择器
         * @param callback 回调函数, 在每个目标元素上触发一次。
         * 回调函数接收 2 个参数
         *  第一个是符合选择器的元素
         *  第二个表明该元素是否为新插入的（已有为 false，插入为 true）
         *      已有的为 querySelectorAll 搜索出来的
         *      插入的为 MutationObserver 监听到的
         *
         *  callback 类型为 (el: Element, isNew: boolean) => boolean
         *  如果 callback 返回值 === false, 则停止监听
         *
         * @param options 一个对象
         *  - parent 父元素, 默认值是 document
         *
         * @return void
         */
        each(selector, callback, options: IEachOptions = {}) {
            let {
                parent: _paramParent = doc,
            } = options;

            if (mode === 'jquery' && _paramParent instanceof $) {
                _paramParent = (_paramParent as JQuery).get(0) ?? doc;
            }

            // 经过上面的处理, l_options.parent 一定会是 Element | Document, 所以 IGetOne 是安全的

            let paramParent = _paramParent as Element | Document;

            const curMode = mode;
            const refs = new WeakSet<any>();

            for (const node of queryAll(selector, {parent: paramParent, root: paramParent, curMode: curMode})) {
                refs.add(curMode === 'jquery' ? (node as JQuery).get(0) : node);
                if (callback(node, false) === false) return;
            }

            const filter = (
                el: Node,
                reason: FilterReasonType
            ) => {
                for (const node of queryAll(selector, {parent:el, root:paramParent, curMode: curMode, reason: reason})) {
                    const _el = curMode === 'jquery' ? (node as JQuery).get(0) : node;
                    if (refs.has(_el)) break;
                    refs.add(_el);
                    if (callback(node, true) === false) {
                        return removeFilter(paramParent, filter);
                    }
                }
            };
            addFilter(paramParent, filter);
        },
        /**
         * 渲染器, 将 html 字符串渲染为元素
         * 渲染也就是 解析 并 挂载 元素
         *  解析为: innerHTML = domString
         *  挂载为: appendChild
         *
         * @param domString html 字符串
         * @param options 一个对象
         *  - parent 父节点，将创建的元素添加到父节点末尾处, 如果不指定, 解析后的元素将 remove, 而不会被挂载
         *      默认值为 doc.body
         *
         *  - returnList 布尔值，是否返回以 id 作为索引的元素列表, 默认值为 false
         *      如 create('<div id="myId"></div>`)
         *      返回 { myId: <div id="myId"></div> (HTMLElement) }
         *
         * @returns {Element|{[id:string]: Element}|null} 元素或对象，取决于 returnList 参数
         */
        create(domString: string, options = {}) {
            let {
                returnList = false,
                parent = doc.body
            } = options;
            const template = doc.createElement('template');
            template.innerHTML = domString;
            const node = template.content.firstElementChild;
            if (!node) return null;
            parent ? parent.appendChild(node) : node.remove();
            if (returnList) {
                const list: any = {};
                node.querySelectorAll('[id]').forEach(el => list[el.id] = el);
                list[0] = node;
                return list;
            }
            return node;
        },
        selector(desc: any) {
            switch (true) {
                case isJquery(desc):
                    $ = desc;
                    mode = 'jquery';
                    break;
                case !desc || typeof desc.toLowerCase !== 'function':
                    mode = 'css';
                    break;
                case desc.toLowerCase() === 'jquery':
                    // @ts-ignore
                    for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
                        if (isJquery(jq)) {
                            $ = jq;
                            break;
                        }
                    }
                    // @ts-ignore
                    mode = $ ? 'jquery' : 'css';
                    break;
                case desc.toLowerCase() === 'xpath':
                    mode = 'xpath';
                    break;
                default:
                    mode = 'css';
                    break;
            }

            return mode;
        }
    } as IElmGetter;
}() as CSSElmGetterType;

interface IEachOptions {
    parent?: Element | JQuery | Document;
}
