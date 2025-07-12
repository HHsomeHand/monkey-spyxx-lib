export interface ISpyXX {
    getSelector: () => Promise<string>;
    getParent: (selector: string) => Promise<string>;
}
