//第一步先实现基本的myPromise构造函数，添加基本的处理
//第二步，进一步完善resolve和reject方法
//第三步，实现then函数,这一步根据Promises/A+规范需要定义一个辅助函数
// 第4步：实现catch方法
class myPromise {
    constructor(executor) {
        // 接收一个executor执行器函数，立即执行
        // promise有三种状态： pending,fulfilled,rejected
        //首先应该是初始化：pending
        this.status = "pending";
        this.value = undefined;
        this.reason = "Initialization failed";
        // 初始化成功处理/失败处理函数队列
        this.onFulfiiedCallbacks = [];
        this.onRejectedCallbacks = [];
        // 定义resolve方法
        const resolve = (value) => {
            if (this.status === "pending") {
                this.status = "fulfilled";
                this.value = value;
                // 执行所有的成功处理函数
                this.onFulfilledCallbacks.forEach(callback => callback());
            }
        };

        // 定义reject方法
        const reject = (reason) => {
            if (this.status === "pending") {
                this.status = "rejected";
                this.reason = reason;
                // 执行所有的失败处理函数
                this.onRejectedCallbacks.forEach(callback => callback());
            }
        };

        //执行executor
        try {
            executor(resolve, reject);
        }
        catch (error) {
            // 若执行出错，那么认为“期望”并没有达成，所以promise状态为 rejected
            reject(error);
        }
    }

    // 实现then方法
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

        //创建一个新的promise实例promise2
        const promise2 = new myPromise((resolve, reject) => {
            if (this.status === 'fulfilled') {
                // 用setTimeout来保证异步调用，好像这个方法比较古早
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            } else if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error)
                    }

                });
            } else if (this.status === 'pending') {
                this.onFulfiiedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    });
                });

            }
        });
        // 返回新的Promise实例，以便链式调用
        return promise2;
    };

    // 实现catch方法
    catch(onRejected) {
        return this.then(null, onRejected);
    }

    //实现finally方法
    finally(callback) {
        return this.then(
            value => { return myPromise.resolve(callback()).then(() => value) },
            reason => { return myPromise.resolve(callback()).then(() => { throw reason; }) }
        );
    }

    //实现Promise.resolve和Promise.reject静态方法
    static resolve(value) {
        if (value instanceof myPromise) {
            return value;
        }
        return new myPromise((resolve, reject) => {
            resolve(value);
        });
    }

    static reject(reason) {
        return new myPromise((resolve, reject) => {
            reject(reason);
        });
    }

    //实现Promise.all和Promise.race静态方法
    // all方法用于将多个Promise实例包装成一个新的Promise实例，只有当所有的Promise实例都成功时，新的Promise实例才会成功；
    // race方法则是将多个Promise实例包装成一个新的Promise实例，只要其中一个Promise实例成功或失败，新的Promise实例就会立即成功或失败。
    static all(promises) {
        return new myPromise((resolve, reject) => {
            const result = [];
            let resolvedCount = 0;

            promises.forEach((promise, index) => {
                myPromise.resolve(promise).then(
                    value => {
                        result[index] = value;
                        resolvedCount++;
                        if (resolvedCount === promises.length) {
                            resolve(result);
                        }
                    },
                    reason => {
                        reject(reason);
                    }
                )
            })
        })
    };

    static race(promises) {
        return new myPromise((resolve, reject) => {
            promises.forEach(promise => {
                myPromise.resolve(promise).then(
                    value => {
                        resolve(value);
                    },
                    reason => {
                        reject(reason);
                    }
                )
            })
        })
    }

    // 实现Promise.allSettled和Promise.any静态方法
    // allSettled方法用于将多个Promise实例包装成一个新的Promise实例，只要所有的Promise实例都完成（成功或失败），新的Promise实例就会成功；
    // any方法则是将多个Promise实例包装成一个新的Promise实例，只要其中一个Promise实例成功，新的Promise实例就会立即成功。如果所有实例都失败，新的Promise实例将失败。

    static allSettled(promises) {
        return new myPromise((resolve, reject) => {
            const result = [];
            let settledCount = 0;

            promises.forEach((promise, index) => {
                myPromise.resolve(promise).then(
                    value => {
                        result[index] = { status: 'fulfilled', value };
                        settledCount++;
                        if (settledCount === promises.length) {
                            resolve(result);
                        }
                    },
                    reason => {
                        result[index] = { status: 'rejected', reason };
                        settledCount++;
                        if (settledCount === promises.length) {
                            resolve(result);
                        }
                    }
                )
            })
        })
    } static any(promises) {
        return new myPromise((resolve, reject) => {
            const errors = [];
            let rejectedCount = 0;

            promises.forEach((promise, index) => {
                myPromise.resolve(promise).then(
                    value => {
                        resolve(value);
                    },
                    reason => {
                        errors[index] = reason;
                        rejectedCount++;
                        if (rejectedCount === promises.length) {
                            reject(new AggregateError(errors, 'All promises were rejected'));
                        }
                    }
                );
            });
        });
    }


};

//该函数用于处理then方法返回的新Promise实例以及成功或者失败的结果
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) { return reject(new TypeError('Chaining cycle deteced for Promise')) };

    let called = false;

    if (x instanceof myPromise) {
        x.then(
            y => {
                resolvePromise(promise2, y, resolve, reject);
            },
            reason => {
                reject(reason);
            }
        );
    }
    else if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        // 如果在x是对象或者是函数的时候
        try {
            const then = x.then;
            if (typeof then == 'function') {
                then.call(x,
                    y => {
                        if (called) return;
                        called = true;
                        // 递归处理y
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    reason => {
                        //失败回调
                        if (called) return;
                        called = true;
                        reject(reason);
                    }
                );
            }
            else {
                // 若then不属于函数
                resolve(x);
            }
        }
        catch (error) {
            if (called) return;
            called = true;
            reject(error);
        }
    } else {
        //若x不是对象也不是函数
        resolve(x);
    }
}