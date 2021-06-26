# 随手记
1. 数据的属性描述符
属性描述符分为数据描述符和存取描述符的其中一种，不能同时设置。
- 两者共有的属性：configurable、enumerable
- 数据描述符属性：value、writable
- 存取描述符属性：get、set、
---
2. 模块加载方案
- ES6
ES6的运行原理是当JS引擎对脚本进行静态分析时， 遇到import， 会生成一个只读引用，等到脚本执行时， 再根据这个引用去读取值。

ES6和commonJS区别：
- commonJS导出的是**值的拷贝**，模块内部改变原始值不会影响到外部, 但是引用值会； ES6输出的是值的引用。
- commonJS是运行时加载, ES6是编译时加载

3. thunk函数(偏函数)
偏函数就是通过接收一定的参数，产出一些定制化的函数。如下`isType`就是一个偏函数。
```javascript
function isType(type) {
  return (obj) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
  }
}
// 定制化函数
let isString = isType('String')
let isFunction = isType('Function')

```
---
3. `typeof null`的结果为什么是`object`？
在JS的最初版本中使用的是32位系统，为了性能考虑使用低位存储变量的类型信息。000开头代表对象，但null是全零。因此被判断为`object`。

4. 强引用和弱引用

```javascript
// 能够读到{a: 1}这个对象是因为obj这个变量保存着对它的引用
const obj = { a: 1 }
obj = null

// 2.
const obj = { a: 1 }
const arr = [obj]
obj = null
```

如上，第一种情况时，当我们设置 obj = null 时， 这个对象将会被回收；第二种情况, obj 则不会被回收，因为 arr 保存了它的引用。这其实就是一种强引用。如果一个变量保存着一个对象的强引用，那么这个对象将不会被垃圾回收；如果保存一个对象的弱引用，那么这个对象将可以被垃圾回收。以 map 和 WeakMap 为例：

```javascript
// 1. map

let obj = { name: 'toto' }
let mapObj = new Map()
mapObj.set(obj, 'any value')

obj = null
mapObj.size() // 1

// 2. WeakMap
let obj = { name: 'toto' }
let weakmapObj = new WeakMap()
weakmapObj.set(obj, 'any value')
obj = null
```

参考资料：<a href="https://github.com/mqyqingfeng/Blog/issues/92">https://github.com/mqyqingfeng/Blog/issues/92</a>

#### 手写一个发布订阅模式
```javascript
class EventEmitter {
  constructor() {
    this.events = {}
  }
  //  监听
  on(event, cb) {
    if(this.events[event]) {
      this.events[event].push(cb)
    } else {
      this.events[event] = [cb]
    }
  }
  // 触发
  emit(event) {
    this.events[event] && this.events[event].forEach(cb => cb())
  }
  // 移除
  remove(event, callback) {
    if(this.events[event]) {
      this.events[event] = this.events[event].filter
    }
  }
  // 只执行一次
  once(eventName, cb) {
    let fn = () => {
      cb()
      this.remove(eventName, cb)
    }
    this.on(eventName, fn)
  }
}
```