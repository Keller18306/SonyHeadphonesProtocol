export type OutsidePromise<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}

export function createPromise<T = void>(): OutsidePromise<T> {
    let promiseResolve: (value: T | PromiseLike<T>) => void,
        promiseReject: (reason?: any) => void;

    let promise = new Promise<T>(function (resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
    });

    return {
        promise,
        resolve: promiseResolve!,
        reject: promiseReject!
    }
}