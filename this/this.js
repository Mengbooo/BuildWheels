// 参考下面的写法自行测试
// new方法只需要实现一个功能相同的函数即可

// - 了解this的指向问题
// - 了解call apply bind的使用方法
// - 尝试自己实现call apply bind new这四个函数
Function.prototype.myCall = function (context, ...args) {
    context = context ? context : window;
    console.log(context.str);
    console.log(...args);
}
Function.prototype.myApply = function (context, args) {
    context = context ? context : window;
    console.log(context.str);
    // 用forEach会导致分行打印
    //     console.log(element);
    // args.forEach(element => {
    // });

    //采用join会转变为字符串
    console.log(args.join(' '));
}
Function.prototype.myBind = function (context, ...args) {
    context = context ? context : window;
    console.log(context.str);
    console.log(...args)
}
Function.prototype.myNew = function (context, ...args) {
    const obj = {
        innerObj: null,
        innerargs: null,
    };
    obj.innerObj = context;
    obj.innerargs = args;
    console.log(obj.innerObj.str);
    console.log(...obj.innerargs);
    return obj;
}


// new操作符具体干了什么呢? 其实很简单，就干了三件事情。
// var obj = new Base();

// var obj  = {};
// obj.proto = Base.prototype;
// Base.call(obj);
// 第一行，我们创建了一个空对象obj;
// 第二行，我们将这个空对象的 __proto__ 成员指向了 Base 函数对象 prototype 成员对象;
// 第三行，我们将 Base 函数对象的 this 指针替换成obj，然后再调用 Base 函数，于是我们就给 obj 对象赋值了一个 id 成员变量，
// 这个成员变量的值是 ”base” ，关于 call 函数的用法。


// 测试
function fn(a, b, c) {
    console.log(this.str)
    console.log(a, b, c)
}

let obj = { str: 'test' };
fn.myCall(obj, 1, 2, 3);
fn.myApply(obj, [1, 2, 3]);
fn.myBind(obj, 1, 2, 3);
fn.myNew(obj, 1, 2, 3);
let index = fn.myNew(obj, 1, 2, 3);//是这个意思吗？
console.log(index);
