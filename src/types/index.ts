export interface ISpyXX {
    /**
     * 如果用户选择了元素, 则返回元素的选择器.
     * 如果用户取消了选择, 则返回空字符串, Boolean("") === false.
     */
    getSelector: () => Promise<string>;
    getParent: (selector: string) => Promise<string>;
}
