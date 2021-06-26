# 数组扁平化

扁平化就是将多维数组转为一维数组。

1. 利用 reduce 和 concat

```javascript
function flatten(arr) {
  return arr.reduce((cur, next) => {
    return cur.concat(Array.isArray(next) ? flatten(next) : next)
  }, [])
}
```

2. 手动实现

```javascript
function flat1(arr) {
  var result = []
  for (var i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flat1(arr[i]))
    } else {
      result.push(arr[i])
    }
  }
  return result
}
```

3. arr.flat

```javascript
let flatArr = arr.flat(Infinity)
```

4. toString 和 replace
   将数组转化为字符串，然后将所有的`[`和`]`替换为空

```javascript
let flatArr = arr
  .toString()
  .replace(/(\[|\])/g, '')
  .join(',')
```

缺点：

- 如果为数字类型，那么值的类型被改变为字符串

5. JSON.parse
其实原理同上面第4种方法, 第4中使用join进行拼接, 这里使用JSON.parse

```javascript
function flat3(arr) {
  let str = arr.toString().replace(/(\[|\])/g, '')
  str = '[' + str + ']'
  return JSON.parse(str)
}
```
缺点：
- 字符串类型的可能被转为数字类型了
