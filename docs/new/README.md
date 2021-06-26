# js 之 new 的实现原理及手写

作用/实现过程

new 用于产生构造函数的一个新的实例，在 new 的过程中，主要完成了以下四个步骤：

- 创建一个空对象，将空对象的原型指向构造函数的原型对象
- 将构造函数中的 this 修改为空对象，并执行构造函数中的逻辑
- 判断构造函数是否存在返回值，如果返回的是一个**对象**，则实例只能访问这个返回的对象中的属性；反之，则返回实例。eg:

```javascript
function Foo(name, age) {
  this.name = name
  return {
    age: age,
  }
}

const bar = new Foo('wind', 18)
bar.name // undefined
bar.age // 18
```

```javascript
function myNew(ctor, ...args) {
  let obj = new Object()
  obj.__proto__ = Object.create(ctor.prototype)
  let res = ctor.apply(obj, args)
  return typeof res === 'object' ? res || instance : instance
}
```
