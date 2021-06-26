# async/await 的执行机制

协程: A和B都是一个协程；

父协程：B在A中执行了，所有A是B的父协程。

```javascript
function* A() {
  console.log('我是A')
  yield B()
  console.log('结束了')
}
function B() {
  console.log('我是B')
  return 100
}
```

#### 1. async
`async`是一个通过异步执行并隐式返回Promise的函数。

#### 2. await
**当在函数中遇到await时，先执行await后面的表达式，但是不处理结果，然后让出线程。**

`await`的执行顺序到底是什么？如下分析：

```javascript
async function test() {
  console.log(100)
  let x = await 200
  console.log(x)
  console.log(200)
}
console.log(0)
test()
console.log(300)
```

首先，进入执行同步代码，打印`0`，然后执行test，打印`100`，下面就遇到了令人费解的`await`, 执行代码
```javascript
// 个人理解: 遇到await之后, 会创建一个promise对象, 将test还未执行的内容放到该这个promise的then方法中
// 其实就是将这些内容放到了微任务当中
await 100
```
JS 引擎会将上面的代码转为一个promise：
```javascript
let promise = new Promise((resolve, reject) => {
  resolve(100)
})
```
然后，JS引擎将暂停当前协程(这里是test)的运行，把线程的执行权交给父协程(全局)，在父协程中，立即对await返回的promise调用then，来监听这个promise状态的改变。
```javascript
promise.then(() => {
  // resolve后调用
})
```
执行父协程中的代码，打印`300`。根据Eventloop机制, 当前线程的宏任务完成，现在执行微任务队列中的任务，这个then方法主要做以下两件事情：
```javascript
promise.then((value) => {
  // 将线程的执行权交给test协程
  // 将resolve的value值传递给test
})
```
现在又回到了test协程，打印`200 200`
