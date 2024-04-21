# BuildWheels
是不是这么翻译呢，似乎并不是，正确的“造轮子”这个词就是先有英文然后直接被翻译过来的。可参考维基百科比较详细的解释。Additionally, those new to a language (and especially those new to programming) will often attempt to manually write many functions for which a more robust and optimized equivalent already exists in the standard library or other easily available libraries.
## This
this的指向性问题真是让新手迷糊，让一些老手蒙圈。其实this就是this，它的指向与这个“this”的“运行环境”或者叫“依托对象”强相关。
这是我觉得讲的比较透彻的几篇文章：
https://blog.csdn.net/ZYS10000/article/details/113447144  
这个是讲new的，（其实我还以为是自己写一个“new Function”来着，这玩意用的应该不多，基本用new都是创建一个对象）

https://zhuanlan.zhihu.com/p/42145138 
讲this，call，apply（才发现call和apply不是很麻烦，似乎是jsinfo的翻译有些问题吧）
## XHR与Fetch
原来，Ajax并非我之前想那么高端，我还一直以为他是类似于axios的那种“库”    
阮一峰讲的挺好 https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html
 
polyfill的实现，真的很适合拿来练手