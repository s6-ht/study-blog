# Vue 响应式原理

> vue 源码版本：2.6.12

在 vue2 当中，数据的响应式是用过`Object.defineProperty` api 来实现的。且其中对 Object 类型和 Array 类型使用不同方式进行处理。


### 对象的响应式
将data传给实例后，开始执行响应式操作：
1. 进入`observe`方法，如果数据类型是**对象/数组**，则对该项数据添加`__ob__`属性(包括 data 本身也要添加)。

>__ob__属性的作用：<br>
(1) 保存了 Observer 上的方法、dep 等值，以便于处理数组操作时可以直接从该属性中拿到相关方法即属性；<br>
(2) 存在该属性的对象/数组，说明数据此时已经是响应式的了，避免重复进行响应式处理。

2. 对该对象进行遍历，并且为每一个属性创建一个订阅器实例(dep)，用于存放订阅者。
3. 使用`Object.defineProperty` 重写每一个属性的setter、getter 方法。
- setter：如果值发生了变化，就将新的值赋值给其对应的属性，再判断新的值是否是对象，如果是，回到步骤 1 开始递归；反之则通知所有的订阅者，更新视图。
- getter：


### 数组的响应式

数组的响应式与对象的响应式不同的实现方式在于第 3 步，数组是通过对数组原型的重写。在原型中，通过值的`__ob__`属性，拿到所有的订阅者，从而在数据改变之后，通知订阅者进行视图更新。

源码分析如下：

> vue 实例中传入的属性初始化顺序：props > methods > data > computed > watch

```javascript
// src/core/instance/initState.js
function initData(vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
  //...这里是一些data的格式校验以及data中的属性名是否与props/methods重复校验。
  // 从上面的初始化顺序就可以看出来为什么不检查computed和watch啦～

  // 响应式数据start
  observe(data, true /* asRootData */)
}
```

```javascript
// src/core/observer/index.js
export function observe(value: any, asRootData: ?boolean): Observer | void {
  // 不是对象直接退出, 能够进来的就是数组和对象
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 如果对象中已经存在__ob__属性，不再重复进行响应式处理
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
}

export class Observer {
  value: any
  dep: Dep
  vmCount: number // number of vms that have this object as root $data
  constructor(value: any) {
    this.value = value
    // 会为每个对象/数组创建一个订阅器实例，用于存放订阅者
    this.dep = new Dep()
    // 1. 给值添加一个__ob__属性，并且指向了Observer实例, 也就是属性中保存了dep和value, 在数组方法改写的时候可以从该属性上获取实例方法
    // 2. 已经是双向绑定的数据都会有__ob__属性, 不用再重复进行双向绑定操作
    def(value, '__ob__', this)
    // 判断值是不是数组,如果为数组，则重写数组原型
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 如果数组中还包含数组，递归执行observe判断
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(obj: Object) {
    const keys = Object.keys(obj)
    // 遍历键, 给每一个属性添加数据劫持
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// 数据劫持部分
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 每个属性都创建一个订阅器
  const dep = new Dep()
  // 获取每个属性的数据描述符, 如果数据不可配置, 退出
  const property = Object.getOwnPropertyDescriptor(obj, key)
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  // 如果该值是对象，递归
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 获取该值，其实都是通过get方法拿到返回的值
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      // Dep.target 暂时未知是怎么来的
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      // 更新值，更新完成后，通知订阅器更新视图
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    },
  })
}
```

数组原型的重写：

```javascript
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]
methodsToPatch.forEach(function(method) {
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args)
    // 获取到刚刚存的__ob__属性
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // 通知订阅者
    ob.dep.notify()
    return result
  })
})
```
