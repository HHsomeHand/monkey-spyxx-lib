// src/types/elmGetter.d.ts

export interface IGetOptions {
    parent?: Element | JQuery | Document;
    timeout?: number;
    onError?: (selector: string) => void;
    isPending?: boolean;
    errEl?: Element;
}

export type ResultType = Element | JQuery<Element> | Node;

export type ModeType = 'css' | 'xpath' | 'jquery';

export interface IElmGetter {
    /**
     * 超时 timeout, 默认为 0, 永不超时
     * 请仅在 dev 模式下使用, timeout 不为 0 时, 会启动定时器 setTimeout, 会导致性能问题
     *
     * if (import.meta.env.MODE === "development") {
     *  // 仅在开发时执行
     *  monkeyWindow.elmGetter.timeout = 3000;
     * }
     */
    timeout: number;

    // 超时后的回调函数
    // 默认为 console.warn 打印
    onError: (selector: string) => void;

    // 超时后的 promise 是否 pending
    // 默认为 true
    isPending: boolean;

    // 超时时, 且 isPending 为 false, 将返回的元素
    // 默认为一个删不掉的 div.not-found 元素
    errEl: Element;

    // [getter readonly] 当前模式, 如 'css'
    currentSelector: string;

    /**
     * 异步的 querySelector
     * @param selector 选择器, 可以为数组
     * @param options 一个对象
     *  - parent 父元素, 默认值是 document
     *
     *  - timeout 设置 get 的超时时间, 默认值是 elmGetter.timeout, 其值默认为 0
     *      - 如果该值为 0, 表示永不超时, 如果 selector 有误, 返回的 Promise 将永远 pending
     *      - 如果该值不为 0, 表示等待多少毫秒, 和 setTimeout 单位一致
     *
     *  - onError 超时后的失败回调, 参数为 selector, 默认值为 elmGetter.onError, 其默认行为是 console.warn 打印 selector
     *
     *  - isPending 超时后 Promise 是否仍然保持 pending, 默认值为 elmGetter.isPending, 其值默认为 true
     *
     *  - errEl 超时后 Promise 返回的值, 需要 isPending 为 false 才能有效, 默认值为 elmGetter.errorEl,
     *      其值默认为一个 "class 为 no-found" "remove 为 () => {}" 的元素
     * @return 根据参数决定返回值
     *  如果 selector 为 字符串数组, 则返回 Promise<Element[]>
     *  如果 selector 为 字符串, 则返回 Promise<Element>
     */
    get(selector: string, options?: IGetOptions): Promise<ResultType>;
    get(selectors: string[], options?: IGetOptions): Promise<ResultType[]>;

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
    each(
        selector: string,
        callback: (el: ResultType, isNew: boolean) => boolean | void,
        options?: {parent?: HTMLElement}
    ): void;

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
     *      返回 { myId: <div id="myId"></div> (HTMLElement), '0': <div id="myId"></div> }
     *
     * @returns {Element|{[id:string]: Element}|null} 元素或对象，取决于 returnList 参数
     */
    create(
        domString: string,
        options?: {
            parent?: Element,
            returnList?: false,
        }
    ): Element | null;

    create(
        domString: string,
        options?: {
            parent?: Element,
            returnList?: true,
        }
    ): any;

    // 切换模式
    selector(desc: any): ModeType;
}

export type CSSElmGetterType = Omit<IElmGetter, 'get' | 'each'> & {
    get(selector: string, options?: IGetOptions): Promise<Element>;
    get(selectors: string[], options?: IGetOptions): Promise<Element[]>;

    each(
        selector: string,
        callback: (el: Element, isNew: boolean) => boolean | void,
        options?: {parent?: HTMLElement}
    ): void;
}

export type JQueryElmGetterType = Omit<IElmGetter, 'get' | 'each'> & {
    get(selector: string, options?: IGetOptions): Promise<JQuery>;
    get(selectors: string[], options?: IGetOptions): Promise<JQuery[]>;

    each(
        selector: string,
        callback: (el: JQuery, isNew: boolean) => boolean | void,
        options?: {parent?: HTMLElement}
    ): void;
}

export type XpathElmGetterType = Omit<IElmGetter, 'get' | 'each'> & {
    get(selector: string, options?: IGetOptions): Promise<Node>;
    get(selectors: string[], options?: IGetOptions): Promise<Node[]>;

    each(
        selector: string,
        callback: (el: Node, isNew: boolean) => boolean | void,
        options?: {parent?: HTMLElement}
    ): void;
}
// declare global {
//     interface Window {
//         elmGetter: IElmGetter;
//     }
// }

export {};

