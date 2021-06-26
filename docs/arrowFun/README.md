# es6中的箭头函数

1. 没有this, 通过查找作用域链确定this(也就是在创建时就确定了), 也就是最近的一个非箭头函数的this。因此，也不能使用call、apply、bind
2. 没有arguments
3. 没有原型，不能通过new关键字调用。javascript函数有两个内部方法[Call]] 和 [[Construct]]：
  - 通过new 调用时,  执行[[Construct]]方法
  - 直接调用时，执行[Call]]方法
箭头函数没有prototype（new过程中会用到原型）, 也就没有[[Construct]]方法，因此不能通过new 调用。
4. 没有new.target
6. 没有super