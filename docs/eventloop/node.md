# node中的事件循环机制

#### 一. 宏任务
- setTimeout
- setInterval
- setImmediate

#### 二. 微任务
- process.nextTick（执行微任务时优先于其它微任务先执行）
- promise.then/catch/finally

#### 三. node.js的运行机制：
1. V8引擎解析js脚本
2. 解析后的代码调用node api
3. libuv库负责node api的运行。它将不同的任务分配给不同的线程，形成一个eventloop，然后以异步的方式将任务的结果返回给V8引擎。
4. V8引擎在将结果返回给用户



#### 四. eventloop
node.js中的eventloop主要分为以下6个阶段：

1. timer阶段<br>
检查定时器，如果到了时间，就执行回调。
2. I/O 异常callback<br>
比如说 TCP 连接遇到ECONNREFUSED，就会在这个时候执行回调。
3. 空闲、预备状态
4. poll阶段<br>
该阶段主要做两件事情，执行I/O回调和处理轮询队列中的事件：
- 如果有定时器并且到时间了，回到timer阶段并执行定时器；
- 没有定时器，则检查回调函数队列：
  - 如果队列不为空，拿出队列中的回调依次执行
  - 队列为空，检查是否存在setImmediate的回调
    - 有则进入check阶段
    - 没有则继续等待（一段时间），等callback被加入队列，然后立即执行回调。一段时间后自动进入check阶段
5. check阶段，执行setImmediate的回调
6. 关闭事件的回调阶段，执行close事件的callback，例如`socket.on('close'[,fn])`或者`http.server.on('close, fn)`
