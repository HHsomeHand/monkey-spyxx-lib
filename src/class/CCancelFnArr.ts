type CancelFnType = () => void;
type CancelFnArrType = CancelFnType[];

// C 为 class 前缀, 这里不是打错了
export class CCancelFnArr {
    constructor(public arr: CancelFnArrType = []) {}

    push(fn: CancelFnType) {
        return this.arr.push(fn);
    }

    doCancel() {
        for (const cancelFn of this.arr) {
            cancelFn();
        }
    }

    getDoCancelFn() {
        return () => {
            this.doCancel();
        };
    }
}

export default CCancelFnArr;
