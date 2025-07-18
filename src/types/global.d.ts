export interface ISpyXX {
    /**
     * 如果用户选择了元素, 则返回元素的选择器.
     * 如果用户取消了选择, 则返回空字符串, Boolean("") === false.
     *
     * 设计成返回选择器, 是因为油猴开发者需要用 LocalStorage 或是 GM_SetValue 来保存配置
     * 直接返回元素反而不方便, 保存配置
     */
    getSelector: () => Promise<string>;

    /**
     * 通过输入的选择器, 让用户选择其父元素
     *
     * 模仿 adblock
     * @param selector
     */
    getParent: (selector: string) => Promise<string>;
}

declare global {
    interface Window {
        spyXX: ISpyXX;
    }
}

export {};
