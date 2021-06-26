# vue 面试题合集

#### 1. 什么是MVVM, 与jquery有什么区别？ 
MVVM及数据驱动视图，通过视图与状态之间的映射关系，然后通过映射关系来驱动视图。jquery更像是一种命令式的关系，既需要判断状态，还需要操作dom。
> 参考链接：https://juejin.cn/post/6844903674116833287
2. 简述vue的响应式原理？（数据劫持、发布订阅者模式、依赖收集）
#### 3. 模版编译原理？
模版编译的最终结果是将html转化为render函数。模版编译分为两步：
- 生成ast语法数。通过正则表达式进行匹配，匹配到标签则对标签的名称及上面的属性等进行解析，生成ast树，解析完成后将这段字符串从html上截取掉，依次循环，直到html为空。
- 将AST转化成render函数。首先将ast转化为`code = _c('div', {id: app})`这样的形式；然后创建一个新函数，其实就是render函数，返回`with(this) { return code }`, 使用with可以改变code代码执行时的作用域。
> 参考资料：https://juejin.cn/post/6936024530016010276
#### 4. computed和watch的原理及区别？

#### 5. $nextTick的原理？（通过维护一个异步队列）
#### 6. diff算法？
> 参考资料：https://juejin.cn/post/6844903607913938951
#### 7. keep-alive原理？
- 使用keep-alive之后当我关掉这个标签也之后，不发请求的问题
#### 8. directives指令实现原理？
#### 9. 介绍vue-router？
#### 10. 介绍vuex?
#### 11. vue的声明周期？
#### 12. vue3的新特性？
- 数据监测机制的改变
- composition api的改变
#### 针对于vue项目，曾经做过哪些优化？


https://juejin.cn/post/6844904031983239181
https://juejin.cn/post/6844904069182521351#heading-5
