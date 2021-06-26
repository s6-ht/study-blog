# js 之实现继承的多种方式

javascript 中的继承是通过原型链来实现的。通过让原型对象等于另外一个类型的实例，这样原型对象就将包含一个指向另外一个原型的指针，另外一个原型中也包含着一个指向另外一个构造函数的指针。以此递归，就形成了原型链。

#### 1. 原型链继承

```javascript
function SuperType() {
  this.colors = ['red']
  this.getColors = function () {
    console.log(this.colors)
  }
}
SuperType.prototype.getColors = function() {
  console.log(this.colors)
}

function Child() {}
// 此时Child.prototype就拥有了SuperType中的所有属性和方法
Child.prototype = new SuperType()
var child1 = new Child()
var child2 = new Child()
```

缺点：

- 无法在不影响其他 child 实例的情况下，给 SuperType 传参
- 当 SuperType 中的属性为基本类型的值时，实例如果修改值就只能给这个属性重新<font color="red">赋值</font>, 此时就相当于给实例本身加上了这个属性，读取值的时候会读取自身的这个属性，而不会去读取原型上的。eg:

```javascript
// SuperType
this.name = 'wind'

console.log(child1) // {}
// 赋值：相当于给child1自身加上了name属性
child1.name = 'child1'
console.log(child1) // {name: 'child1'}
```

- 当 SuperType 中的属性为引用类型的值时，如果在实例上给这个属性重新赋值，则表现和基本类型的值一样; 如果<font color="red">修改</font>其中的属性时，由于这个属性在 Child 的原型上，所以是所有实例共享的，一修改则影响全部实例。

```javascript
// SuperType
this.colors = ['red']

// 修改属性: 此时实例都访问的是原型上的colors属性
child1.colors.push('green')
console.log(child1.colors) // {colors: ['red', 'green']}
console.log(child2.colors) // {colors: ['red', 'green']}

console.log(child1) // {}
// 赋值：相当于给child1自身加上了colors属性
child1.colors = ['black']
console.log(child1) // {colors: ['black']}
```

#### 2. 借用构造函数（经典继承）

其原理是在子类型的构造函数中，调用超类型构造函数。这样就可以解决原型中属性存在引用类型值所带来的问题。

```javascript
function SuperType() {
  this.colors = ['red']
}
function Child() {
  // 传入this(this代表实例), 执行SuperType函数中的方法
  SuperType.call(this)
}

var child1 = new Child()
child1.colors.push('black')
console.log(child1.colors) // {colors: ['red', 'black']}
var child2 = new Child()
console.log(child2.colors) // {colors: ['red']}
```

优点：

- 可以在实例话子类型时，向超类型传递参数
- 避免了引用类型的属性被所有实例共享

缺点：

- 方法都在构造函数中定义，每次创建实例都会创建一遍方法，未进行函数复用

#### 3. 组合继承

该方式其实就是结合原型链继承和借用构造函数继承，使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承，这样即通过在原型上定义方法实现了函数复用，又保证每个实例都有自己的属性。

```javascript
function SuperType() {
  this.colors = ['red']
}
SuperType.prototype.getcolors = function() {
  console.log(this.colors)
}

function Child(name, age) {
  // 继承属性, 第二次执行SuperType
  SuperType.call(this)
  this.age = age
}
// 第一次执行SuperType
Child.prototype = new SuperType()
Child.prototype.constructor = Child
Child.prototype.getAge = function() {
  console.log(this.age)
}

var child1 = new Child('child1', 18)
child1.colors.push('black')
console.log(child1.colors) // ['red', 'black]
child1.getAge() // 18

var child2 = new Child('child2', 3)
console.log(child2.colors) // ['red']
child2.getAge() // 3
```

缺点：

- SuperType 被执行了两次

#### 4. 原型式继承

该方式就是借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。`Object.create()`在传入一个参数的情况下，与该方式行为相同。

**注意：**

- 该方式必须要求传入一个对象，即必须有一个对象作为另一个对象的基础

```javascript
function Object(o) {
  function F() {}
  F.prototype = o
  // new F() 相当于是生成了一个新的实例, 这个实例的__proto__属性指向F.prototype, F.prototype === o
  return new F()
}
```

缺点：

- 引用类型的属性被原有对象和所有实例共享

#### 5. 寄生式继承

创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。

```javascript
function createObj(o) {
  // 任何能够返回对象的方式都可以
  var clone = Object.create(o)
  clone.sayHi = function() {
    console.log('hi')
  }
  return clone
}

var person = {
  name: 'wind',
  colors: ['red'],
}

var instance = createObj(person)
```

缺点：

- 每个实例被创建时，方法都会被重新创建一次，不能复用

#### 6. 寄生组合式继承（最佳）

通过借用构造函数来继承属性，通过寄生式继承来继承超类型的原型。

```javascript
// 寄生式继承 start ----
function object(o) {
  // 其实就是有一个中间者，中间者的原型对象指向o, 这代表子类可以访问o上面的方法；返回一个新的实例，是因为给该实例对象增加方法和属性不会影响到o
  function F() {}
  F.prototype = o
  return new F()
}
function inheritPrototype(child, parent) {
  // prototype为一个新的实例对象, 如果给当前实例上添加方法，则不会影响到F.prototype
  var prototype = object(parent.prototype)
  prototype.constructor = child
  // child.prototype相当于是一个新的实例, child.prototype作为一个整体（是实例而不是原型）
  // child.prototype上添加方法属性其实就是给child.prototype这个实例自身添加方法和属性，因此不会影响到超类型的原型
  child.prototype = prototype
}
// end---

function Parent(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function() {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

inheritPrototype(Child, Parent)
var child1 = new Child('kevin', '18')
console.log(child1)
```
问题：
  - 继承原型上的方法为什么不直接`Child.prototype = Parent.prototype`, 是因为这种情况下修改`Child.prototype`上的方法和属性也都会影响到`Parent.prototype`

