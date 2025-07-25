export interface SpyXXGetSelectorOptionsType {
    // 对话框标题, 默认值为 "请将光标放在目标元素上"
    title?: string;

    // 对话框提示信息, 默认值为空字符串
    description?: string;

    // 对话框提交按钮的文本内容, 默认值为 "提交"
    submitBtnText?: string;

    // 对话框关闭按钮的文本内容, 默认值为 "取消"
    cancelBtnText?: string;

    // 是否显示关闭按钮, 默认值为 true, 为显示关闭按钮
    isShowCancelBtn?: boolean;

    // 是否显示暂停状态, 默认值为 true
    // 当为 true 时, 对话框上会显示当前是否暂停
    // 为 false 时, 对话框不显示 是否暂停
    isShowPauseState?: boolean;

    // 是否显示感应器 (光标在上面滑动, 继续选择), 默认值为 true, 为显示
    isShowInductor?:  boolean;

    // 初始暂停状态, 默认值为 false, 一开始不暂停选择
    // 为 true, 则一开始暂停选择
    // 为 false, 则一开始不暂停选择
    initPauseState?: boolean;

    // 初始的选择器, 默认值为 ""
    initSelector?: string;

    // 是否使用 box shadow 标记选中元素, 默认值为 false
    // 为 false, 则使用方块来标记 当前鼠标选中的元素
    // 为 true, 则使用 box shadow 标记当前鼠标选中的元素
    // 推荐使用 false, box shadow 是第一版的代码遗留下来的 legacy, 可能适用于某些特殊场景
    isUseShadow?: boolean;

    // 事件回调, 当光标选择的元素发生变化的时候, 会调用这个回调函数
    // 默认值为 undefined
    // 返回值为清理函数, 在下一次调用 onCurrSelectElChange 前, 会调用清理函数
    // 具体使用案例可以参考: adblock demo https://scriptcat.org/zh-CN/script-show-page/3851
    onCurrSelectElChange?: ((el: HTMLElement) => (() => void));

    // 需要排除的选择器, 排除的元素将无法被选中
    // 默认值为 []
    excludeSelectors?: string[];

    // 如果 excludeSelectors 无法满足需求, 可以使用本 option
    // 该项的默认值为 undefined
    // 返回 true 为排除, 返回 false 为不排除
    // 排除的元素将无法被选中
    matchExcludeFn?: ((el: HTMLElement) => boolean);
}

export type SpyXXGetParentOptionsType = Omit<SpyXXGetSelectorOptionsType, "initSelector" | "isShowInductor" | "initPauseState" | "isShowPauseState">

export interface ISpyXX {
    /**
     * 如果用户选择了元素, 则返回元素的选择器.
     * 如果用户取消了选择, 则返回空字符串, Boolean("") === false.
     *
     * 设计成返回选择器, 是因为油猴开发者需要用 LocalStorage 或是 GM_SetValue 来保存配置
     * 直接返回元素反而不方便, 保存配置
     */
    getSelector: (options?: SpyXXGetSelectorOptionsType) => Promise<string>;

    /**
     * 让用户选择 selector 的父元素
     *
     * 模仿 adblock
     * @param selector
     */
    getParent: (selector: string, options?: SpyXXGetParentOptionsType) => Promise<string>;
}

declare global {
    interface Window {
        spyXX: ISpyXX;
    }
}

export {};
