# js 之手写 call 和 apply

#### 一、 call

```javascript
var obj = {
  name: 'wind',
}
function foo() {
  let name = 'foo'
  console.log(this.name)
  return name
}
foo.call(obj)
```

当我们调用 call 时，主要完成了以下几件事情：

- 将 foo 中的 this 指向 obj
- 执行 foo 函数

因为`obj.foo()`执行时，`this`指向 foo 的调用者，因此可以将`foo.call(obj)`想象成为`obj.foo()`，此时实现 call 的步骤就为：

- 将函数设置为这个对象的属性
- 执行这个属性
- 删除这个属性

```javascript
Function.prototype.myCall = function(context) {
  // 传null 默认指向window, 原始值需要包装成对象
  context = Object(context) || window
  // this就是foo
  context.fn = this
  // call从第二个参数开始为函数需要的参数
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i])
  }
  var res = context.fn(...args)
  delete context.fn
  // 当函数存在返回值的情况下，需要返回值
  return res
}
```

#### 二、apply

apply 和 call 的原理一样，不过函数中的参数是以<font color="red">数组</font>的形式传入

```javascript
// arr foo函数需要传入的参数数组
Funtion.prototype.myApply = function(context, arr) {
  context = Object(context) || window
  context.fn = this
  var result
  if (!arr) {
    result = context.fn()
  } else {
    var args = []
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']')
    }
    result = context.fn(args)
  }

  delete context.fn
  return result
}
```

#### 三、bind

- bind 执行完成后返回一个新函数
- bind 方法中第一个参数为 this
- 由于返回一个新函数，因此 foo 中的参数可以在 bind 的时候传入一部分，新函数执行的时候传入一部分
- 新函数可以被当作构造函数使用，此时 bind 传入的 this 失效，内部 this 指向 new 出来的实例。eg：
```javascript
var foo = {
    value: 1
}

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}
bar.prototype.friend = 'kevin';
var bindFoo = bar.bind(foo, 'daisy');
```

```javascript
Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new Error(
      'Function.prototype.bind - what is trying to be bound is not callable'
    )
    var self = this
    var bindArgs = Array.prototype.slice.call(arguments, 1)
    var Tempfn = function() {}
    var newfn = function() {
      var newfnArgs = Array.prototype.slice.call(arguments)
      // return 处理函数返回值
      // 被当作构造函数使用时, this指向新的实例
      return self.apply(
        this instanceof self ? this : context,
        bindArgs.concat(newfnArgs)
      )
    }
    Tempfn.prototype = this.prototype
    newfn.prototype = new Tempfn()
    return newfn
  }
}
```
