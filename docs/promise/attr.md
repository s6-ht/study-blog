# 实现Promise的相关方法

#### 1. Promise.resolve

- 首先：
```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

该方法的特性：
- 如果参数是一个promise实例, 那么直接返回这个实例
- 参数是一个`thenable`对象(具有then方法的对象), 那么他们将这个对象执行完成后的最终状态作为自己的状态
- 其它, 直接返回一个成功状态的Promise对象 

```javascript
MyPromise.resolve = function(param) {
  if(param instanceof MyPromise) return param
  return new MyPromise((resolve, reject) => {
    if(param && param.then && typeof param.then === 'function') {
      // then方法中的执行结果作为当前promise的结果
      param.then(resolve, reject)
    } else {
      resolve(param)
    }
  })
}
```
---
#### 2. Promise.reject
- 首先：
```javascript
var p = Promise.reject('出错了');
// 等价于
var p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
```
执行该方法，返回一个rejected状态的Promise, reject中传入的参数，会**原封不动**的被抛出。

- 实现：
```javascript
MyPromise.reject = function(error) {
  return new MyPromise((resolve, reject) => {
    reject(error)
  })
}
```
---

#### 3. Promise.prototype.finally
无论promise是成功还是失败，都会执行finally中的方法。

```javascript
MyPromise.prototype.finally = function(cb) {
  this.then(value => {
    MyPromise.resolve(cb()).then(() => value)
  }, error => {
    MyPromise.resolve(cb()).then(() => throw error)
  })
}
```

#### 4. Promise.all
- 传入参数是一个可迭代对象
- 如果数组中有一个不是promise实例, 则需要将其转为promise
- 有一个promise失败, 则返回一个失败状态的新promise, 并且返回第一个reject的原因
- 所有promise成功, 返回成功状态的新promise, 并且按照顺序返回参数

```javascript
MyPromise.all = function(promises) {
  return new MyPromise((resolve, reject) => {
    let len = promises.length
    let result = []
    if(len === 0) {
      resolve(result)
      return
    }

    const handleData = (data, index) =>{
      result[index] = data
      if(index === len -1) resolve(result)
    }

    for(let i = 0; i < len; i++) {
      // 避免promises[i]不是promise实例, resolve返回的是一个promise, 需要从then中拿到返回值
      MyPromise.resolve(promises[i]).then(data => {
        handleData(data, i)
      }).catch(error => {
        reject(error)
      })
    }
  })
}
```
---

#### 5. 实现Promise.race
只要一个promise执行完成就返回
```javascript
MyPromise.race = function(promises) {
  return new MyPromise((resolve, reject) => {
    let len = promises.length
    if(!len) return
    for(let i = 0; i < len; i++) {
      MyPromise.resolve(promises[i]).then(data => {
        resolve(data)
        return
      }).catch(error => {
        reject(error)
        return
      })
    }
  })
}
```