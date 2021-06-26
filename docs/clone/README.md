# JS 之浅拷贝与深拷贝

#### 1. 浅拷贝

浅拷贝就是将当前对象的值复制一份，而不是直接复制当前对象的引用地址，但是它只能拷贝对象的第一层，如果当前对象中还存在引用类型的值，那么拷贝出来的对象中的这个引用值将还是指向原来的引用地址。

```javascript
const arr = [1, { a: 2 }]
let newArr = arr.slice()
newArr[1].a = 5

// arr[1]是对象, 浅拷贝之后newArr[1]和arr[1]指向的还是同一引用地址
console.log(arr[1]) // 5
```

实现浅拷贝主要有以下几种方法：

1. 手动实现

```javascript
// 判断是引用类型还是原始类型，原始类型直接返回; 引用类型克隆
const shallowClone = (target) => {
  if (typeof target === 'object' && target !== null) {
    let cloneTarget = Array.isArray(target) ? [] : {}
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = target[prop]
      }
    }
    return cloneTarget
  } else {
    return target
  }
}
```

2. concat 浅拷贝数组

```javascript
let arr = [1, 2, 3]
let newArr = arr.concat()
newArr[1] = 6
console.log(arr) // [1, 6, 3]
```

3. slice 浅拷贝数组

```javascript
let arr = [1, 2, 3]
let newArr = arr.slice()
newArr[1] = 6
console.log(arr) // [1, 6, 3]
```

4. 展开运算符

```javascript
let arr = [1, 2, 3]
let newArr = [...arr]
```

5. Object.assign 浅拷贝对象

```javascript
let obj = { name: 'wind', age: 18 }
const obj2 = Object.assign({}, obj, { name: 'wind1' })
console.log(obj2) //{ name: 'wind1', age: 18 }
```

#### 2. 深拷贝

深拷贝就是复制这个对象，拷贝后的对象与源对象完全分离。

实现深拷贝的方法：

1. JSON.parse(JSON.stringify())

```javascript
let obj = { a: 1, b: { name: 'wind' } }
const newObj = JSON.parse(JSON.stringify(obj))
```

缺点：

- 不能拷贝函数
- 不能拷贝一些特殊的对象(RegExp, Date, Set, Map)
- 无法解决循环引用的问题, eg:

```javascript
let obj = { a: 1 }
obj.target = obj
```

2. 手动实现

```javascript
// 1. 检测类型，为原始值直接返回
// 2. 看是否是可遍历的类型, 不可遍历时, boolean/string/number/symbol(包装类，是一个对象)直接调用原型上的valueOf方法, 创建一个新对象并返回值；函数和正则单独处理; date/error直接调用构造器
// 3. 可以遍历, 分别处理map/set/数组和对象

const isObject = target => {
  return (typeof target === 'Object' || typeof target === 'function') && target !== null
}

const traverseType = {
  '[object Set]': true
  '[object Map]': true
  '[object Array]': true
  '[object Object]': true
  '[object Arguments]': true
}

const FUNTIONTAG = '[object Function]'
const DATETAG = '[object Date]'
const REGEXTAG = '[object Regex]'
const ERRORTAG = '[object Error]'
const STRINGTAG = '[object String]'
const NUMBERTAG = '[object Number]'
const BOOLEANTAG = '[object Boolean]'
const SYMBOLTAG = '[object Symbol]'
const MAPTAG = '[object Map]'
const SETTAG = '[object Set]'

const getType = (target) => Object.prototype.toString.call(target)

function handleFunction() {}
function handleRegex(target) {
  const { source, flags } = target
  return new target.constructor(source, flags)
}


const handleNotTraverse = (target, type) {
  let Ctor = target.constructor
  switch(type) {
    case FUNTIONTAG:
      return handleFunction()
    case REGEXTAG:
      return handleRegex()
    case DATETAG:
    case ERRORTAG:
      return new Ctor(target)
    case STRINGTAG:
      return new Object(String.prototype.valueof.call(target))
    case NUMBERTAG:
      return new Object(Number.prototype.valueof.call(target))
    case BOOLEANTAG:
      return new Object(Boolean.prototype.valueof.call(target))
    case SYMBOLTAG:
      return new Object(Symbol.prototype.valueof.call(target))
  }
}


const deepClone = function(target, map => new WeakMap()) {
  if(!isObject(target)) return target

  // 处理不需要遍历的类型，使用构造函数单独处理
  let cloneTarget
  let type = getType(target)
  if(!traverseType[type]) {
    return handleNotTraverse(target, type)
  } else {
    let Ctor = target.constructor
    cloneTarget.constructor = new Ctor()
  }

  if(map.get(target)) {
    return target
  }
  map.set(target, true)
  
  // map
  if(type === MAPTAG) {
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key), deepClone(item))
    })
  }
    
  // set
  if(type === SETTAG) {
    target.forEach(item => {
      cloneTarget.add(deepClone(item))
    })
  }
  
  // 数组和对象
  for(let key in target) {
    if(target.hanOwnProperty(key)) {
      cloneTarget[key] = deepClone(target[key])
    }
  }
  return cloneTarget
}
```
