# js中的函数参数按值传递

>高级程序设计第三版（P70）

无论向函数的参数传递的是一个原始类型的值还是引用类型的值，其实都是**按值传递**的。

当参数是一个原始类型的值时，被传递的值被复制给一个局部变量。

当参数是一个引用类型的值时，其实是将这个值在内存中的引用地址复制给了一个局部变量。如下：
```javascript
function setName(obj) {
  obj.name = 'wind'
}
let person = {
  name: 'person'
}

setName(person)
console.log(person.name) // wind
```
上面执行`setName(person)`时，其实是将person在内存中的地址复制了一份给obj，所以其实person和obj指向同一个地址，当obj.name被改变时，person.name也就被改变了。那我们可能会误解的认为，引用类型的参数传递的时候，其实是**按照引用**传递的。那按照引用是什么意思呢？

之前看高级程序设计时，一直没有理解这句话的意思。在上面的示例中，如果按照引用的话，其实**obj就是person**。那么我们先看下面的示例吧。
```javascript
function setName(obj) {
  obj.name = 'wind'
  obj = {
    name: 'obj'
  }
}
let person = {
  name: 'person'
}

setName(person)
console.log(person.name) // wind
```
从上面看出，如果是按照引用传递，`person`在函数内部其实被重新指向了另外一个内存地址，那么`person.name`应该是obj，但是不是，由此可以看出不是按照引用传递的。

参考资料：
<a href="https://github.com/mqyqingfeng/Blog/issues/10">https://github.com/mqyqingfeng/Blog/issues/10</a>
