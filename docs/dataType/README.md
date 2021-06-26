# js 数据类型检测

#### 1. typeof
typeof可以用来检测原始值的类型，但是引用类型只能检测出funciton和object。

#### 2. instanceof
检测构造函数的prototype属性书否出现在实例的原型链中。
instanceof 用于检测**引用值**的类型。其语法微`A instanceof B`，它是基于被检测值的原型链进行检查，如果B在A的原型链中，就返回ture。
```javascript
function myInstanceof(left, right) {
  if(typeof left !== 'object' || left === null) return false
  left proto = Object.getPrototypeOf(left)
  while(true) {
    // 找到对象原型链的尽头
    if(proto === null) return false
    if(proto === right.prototype) return true
    proto = Object.getPrototype(proto)
  }
}
```

#### 3. 类型转换
JS中，类型转换只有三种：
- 转换为数字
- 转换为布尔值
- 转换为字符串

详细如下：
![image](./type.jpeg)