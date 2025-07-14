type CancelFn = () => void;
type CancelFnArrType = CancelFn[];

export class CancelFnArr {
    constructor(public arr: CancelFnArrType = []) {}

    push(fn: CancelFn) {
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

export default CancelFnArr;
