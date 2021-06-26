# 一个http请求在koa中执行的顺序
oa处理请求的步骤为：监听到请求 ——> 所有的中间件执行 ——> 响应请求
#### 一、监听请求
服务启动时，在listen中会监听request方法，每一次请求都会执行createServer中的callback方法。
```javascript
listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

callback() {
    const fn = compose(this.middleware);
    if (!this.listenerCount('error')) this.on('error', this.onerror);
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
```

#### 二、中间件执行
通过use方法注册中间件，会将中间件依次添加进一个数组中。有请求时，会调用callback方法去执行中间件。中间件模型被称为洋葱模型，主要是compose库进行实现的。
koa-compose源码解析（这段代码真的厉害！！！）
>借助特性：如果Promise.resolve接受的参数，也是个Promise，那么外部的Promise会等待该内部的Promise变成resolved之后，才变成resolved。

```javascript
/**
   * @param {array} middleware  中间件数组
   */
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function (context, next) {
    // index 用于标明上一次执行到了哪个中间件
    let index = -1
    // 从第一个中间件开始执行 
    return dispatch(0)
    // 将所有的中间件函数嵌套成一个大的中间件函数,
    function dispatch (i) {
      // 防止在一个中间件中next方法被调用两次.
      // eg: middleware.length = 3; 当所有中间件函数都被dispatch后, 第二、三个中间执行完毕, 控制权       回到第一个中间件中, 开始执行next后面的逻辑, 但是后面又调用了next, 此时i为0, index = 3,
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      // 当i = length时, fn = undefined 表明已经到了最后一个中间件, 需要返回一个Promise.resove(), 表明当前中间件执行完成，从而把控制权交换给上一个中间件
      let fn = middleware[i] 
      // 预期执行的中间件索引，已经超出了middleware边界，说明中间件已经全部执行完毕，开始准备执行之前传入的next（?）next是fnMiddleware传入的第二个参数, 为undefined
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        // 对中间件的执行结果包裹一层Promise.resolve
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

#### 三、响应请求
compose方法返回一个函数，执行该函数（中间件执行函数）返回一个promise，当resolved时开始响应请求，也就是执行handleResponse方法
```javascript
handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    // 由此看出, next 为undefined; 且响应请求的时机也是在所有中间件执行完毕之后
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```

参考文章：https://blog.csdn.net/weixin_34280237/article/details/91440259