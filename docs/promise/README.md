# 实现Promise

promise 的出现其实主要完成了三件事情：
- 使用 then 方法，对回调函数进行延迟绑定
- 当 Promise 状态改变时， 将执行结果传递给 then， 在 then 中可以获取到promise的执行结果。
- 错误冒泡：执行中遇到错误时， 使用 throw 抛出错误， 从而使其可以被 catch 捕捉到并传递到最后。

Promise 相当于一个状态机， 有三种状态， `pending、fulfilled、rejected`， 流向为`pending ——> fulfilled`或`pending ——> rejected`， 状态一旦改变，不可更改。


Promise 接收一个函数， 函数含有两个参数 resolve 和 reject， 其作用分别如下：
- resolve：将状态从 pending 变为 fulfilled；将异步操作的结果传递给 then； 执行成功异步回调函数。
- reject：将状态从 pending 变为 rejected；将异步操作的结果传递给 catch；执行失败异步回调函数。

```javascript
const PENDING = 'pendig'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function MyPromise(excuator) {
  // 猜测：保存this的作用可能是当在resolve和reject方法如果没有使用箭头函数或者在这个函数外层使用了setTimeout等，
  // 那么reolve方法中的this就不指向MyPromise实例，不能获取到Mypromise中定义的状态、回调数据等数据了。
  let self = this
  self.status = PENDING
  self.value = null
  self.error = null
  // 个人理解：定义为数组主要是为了处理promise中的resolve/reject被放在了异步任务中, 
  // 那么调用then的时候状态为pending, 此时promise的状态还未改变,不能立即执行回调, 
  // 所以只能将回调函数保存起来, 等resolve或者reject被调用时执行回调
  self.onFulfilledCallbacks = []
  self.onRejectedCallbacks = []

  // 状态变为成功
  let resolve = (value) => {
    if (self.status === PENDING) {
      self.value = value
      self.status = FULFILLED
      self.onFulfilledCallbacks.forEach((callback) => callback(self.value))
    }
  }

  let reject = (error) => {
    if (self.status === PENDING) {
      self.error = error
      self.status = REJECTED
      self.onRejectedCallbacks.forEach((callback) => callback(self.error))
    }
  }

  try {
    excuator(resolve, reject)
  } catch (e) {
    reject(e)
  }
}
// 链式调用, 由于promise的状态变化之后不可更改, 因此需要返回一个新的Promise
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === 'function' ? onFulfilled : (value) => value
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : (error) => {
          // 使用throw, 使其能够被catch捕捉到
          throw error
        }
  let bridgePromise
  // 保存this, 调用resolvePromise时会改变this
  let self = this
  if (self.status === FULFILLED) {
    return (bridgePromise = new MyPromise((resolve, reject) => {
      // then方法中的回调其实是在微任务队列中执行的, 因此立即调用了then方法之后，且状态不为pending， 回调函数也不能立马执行。但是js不能接触到微任务的分配，因此使用setTimeout模拟
      setTimeout(() => {
        try {
          let x = onFulfilled(self.value)
          resolvePromise(bridgePromise, x, resolve, reject)
        } catch (e) {
          console.error(e)
          reject(e)
        }
      }, 0)
    }))
  } else if (self.status === REJECTED) {
    return (bridgePromise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onRejected(self.onRejected)
          resolvePromise(bridgePromise, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }, 0)
    }))
  } else if (self.status === PENDING) {
    // 当promise中的resolve放在一个异步操作中时(eg: setTimeut), 会进入这里
    // 先将回调保存, 当Promise中的resolve或者reject被调用时, 执行所有的回调函数
    // resolve和reject决定了bridgePromise的状态, 因为bridgePromise是new MyPromise执行后的一个结果
    return (bridgePromise = new MyPromise((resolve, reject) => {
      self.onFulfilledCallbacks.push((value) => {
        try {
          let x = onFulfilled(value)
          // 解决x
          resolvePromise(bridgePromise, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
      self.onRejectedCallbacks.push((error) => {
        try {
          let x = onRejected(error)
          resolvePromise(bridgePromise, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    }))
  }
}
// resolvePromise
// 1. 如果x为bridgePromise, 抛出类型错误
// 2.1 如果x为对象或者函数, 将x.then赋值给then. 如果x.then抛出错误, 直接reject(e)
//   2.1.1 如果then是函数, 那么执行then, 并且将this设为x, 并且设置resolvePromise和rejectPromise两个回调函数
//       - resolvePromise递归执行promise
//       - 遇到错误reject
//       - resolvePromise和rejectPromise只能被调用一次, 且不能被同时调用
//   2.1.2 如果then不是函数, 则以x为参数执行promise
// 2.2. 如果x不为对象或函数, 则以x为参数执行promise
function resolvePromise(bridgePromise, x, resolve, reject) {
  if (x === bridgePromise) {
    return reject(new TypeError('valid param type error'))
  }
  let called
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        // then中两个方法只能其中一个, 且只能被调用一次
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(bridgePromise, y, resolve, reject)
          },
          (error) => {
            if (called) return
            called = true
            reject(error)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      reject(e)
    }
  } else {
    resolve(x)
  }
}

// test
let promiseTest = new MyPromise((resolve, reject) => {
  // 加上setTimeout就相当于被放在了异步任务中(由于不能模拟微任务, 因此使用setTimeout代替)
  // setTimeout(() => {
  resolve(1)
  // })
})
// 无论promise是什么状态, 只要then被调用, 都会进入then方法中的逻辑; 
// 从使用层面来说, then的成功和失败回调都只有状态变化时才会执行, 
// 因此, 如果状态为pending的情况下, 不能立马执行回调
promiseTest
  .then((data) => {
    console.log(data)
  })
  .then((data) => {
    console.log(2)
  })
  .then((data) => {
    console.log(3)
  })
```



#### 实现 catch
```javascript
MyPromise.prototype.catch = function(onRejected) {
  this.then(null, onRejected)
}
```

但是如下这种情况, 状态已经变为`fulfilled`，再抛出错误也是捕捉不到的。

```javascript
let p = new Promise((resolve, reject) => {
  resolve(1)
  throw new Error('error')
})
```


#### promise 的缺点

1. 无法取消 Promise, 一旦新建就会立即执行, 无法中途取消
2. 当处于 pending 状态时，无法得知进展到哪一个阶段
3. 如果不使用 catch, 无法补捕获到 Promise 内部的错误
