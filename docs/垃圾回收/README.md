# V8引擎的垃圾回收机制
JS环境中分配的内存一般有如下生命周期：

1. 内存分配：当我们申明变量、函数、对象,并执行的时候，系统会自动为他们分配内存
2. 内存使用：即读写内存，也就是使用变量、函数等
3. 内存回收：使用完毕，由垃圾回收机制自动回收不再使用的内存

V8将堆内存分为新生代内存和老生代内存。新生代就是临时分配的内存，存活时间短；老生代是常驻内存，存活时间长。

#### 1. 为什么要进行垃圾回收
V8有内存限制, 在64位系统下，最多只能分配到1.4G。内存被限制是因为：
- JS的执行是单线程的，一旦进入垃圾回收，其它逻辑都需要暂停。
- 垃圾回收耗时
---
#### 2. 新生代内存回收
对新生代内存的回收采用`Scavenge`算法。新生代内存分为分为from和to两个空间，from空间表示正在使用的内存空间，to空间表示目前闲置空间；执行垃圾回收的步骤如下：
- 第一，v8检查from空间，将存活对象按顺序复制到to空间中，非存活对象直接回收；
- 第二，当所有存活对象进入to空间后，from和to空间角色交换，to为正在使用的空间，from闲置；
- 第三，依次循环。

>问题：为什么不直接将非存活对象回收，而是回收之后还需要要交换空间？<br />
是因为将非存活的对象回收之后，from的空间就只剩下存活的对象，此时这些对象零散分布（零散的空间也叫内存碎片），因为堆内存是连续分配的，如果不重新将这些存活对象按序整齐排列在一起，如果遇到比较大的对象，就没有足够的连续空间去分配。

--- 
#### 3. 老生代内存回收
老生代内存中的对象是由新生代晋升来的，以下两种情况会发生晋升：
- 已经经历过一次`Scavenge`算法回收
- to（闲置）空间的内存超过25%

老生代的垃圾回收机制分为三个阶段：
- 标记-清除：首先，遍历内存中的所有对象，给它们加上标记，然后对环境中在使用的变量和被强引用的变量取消标记；在回收阶段将那些存在标记的变量回收；
- 整理内存碎片：回收之后，内存中的空间变得不连续，因此，在清除阶段结束后，将存活的对象向一边靠拢
>增量标记<br />
由于老生代的空间较大，如果回收任务较重，回收的时间可能较长，则严重的影响了应用性能。因此采取了增量标记的方法，将一次完成的标记任务分为很多次，每一执行一小部分，标记完这一小部分之后，继续执行应用逻辑，然后再执行回收，以此循环。直到标记阶段结束，进入内存整理阶段。
