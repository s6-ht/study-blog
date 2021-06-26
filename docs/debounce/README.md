# JS 之如何做防抖和节流

#### 1. 防抖

防抖的原理：在触发事件的 n 秒后执行逻辑，如果在事件触发的 n 秒内再次触发了该事件，则重新计时，直到 n 秒后才执行。

防抖要注意的功能（以 scroll 事件为例）：

- 使用 debounce 后, 需要将 this 保存，否则在 handleScroll 中的 this 变为了 window
- handleScroll 的 e 也需要保存
- 可能会有返回值

```javascript
window.addEventListener('scroll', handleScroll, false)

function handleScroll(e) {}

// immediate: 是否立即执行一次,  隔n秒再执行一次
function debounce(func, wait, immediate) {
  var timeout = null,
    result
  var debounded = function() {
    var self = this
    var args = arguments
    if (timeout) clearTimeout(timeout)
    if (!timeout && immediate) {
      // 因为定时器并不是准确的时间，很可能你设置了2秒，但是他需要2.2秒才触发，这时候就会进入这个条件
      timeout = setTimeout(function() {
        timeout = null
      }, wait)
      result = func.apply(self, args)
    }
    timeout = setTimeout(function() {
      func.apply(self, args)
    }, wait)
    return result
  }
  debounded.cancel = function() {
    clearTimeout(timeout)
    timeout = null
  }
  return debounded
}
```

#### 2. 节流

原理：如果持续触发事件，每隔一段时间，只执行一次事件。

```javascript

// leading：false 表示禁用第一次执行
// trailing: false 表示禁用停止触发的回调
function throttle(func, wait, options) {
  var timeout, self, args, result
  var previous = 0
  if (!options) options = {}

  var later = function() {
    previous = options.leading === false ? 0 : new Date().getTime()
    timeout = null
    func.apply(self, args)
    if (!timeout) self = args = null
  }

  var throttled = function() {
    var now = new Date().getTime()
    
    // 刚进入不执行的情况下，记录当前时间
    if (!previous && options.leading === false) previous = now
    // 判断现在的时间与上一次执行的时间差与 wait的差值
    var interval = wait - (now - previous)
    self = this
    args = arguments
    // 如果间隔已经大于差值，说明已经过了wait秒，或者改了系统时间, 此时执行函数并
    if (interval <= 0 || interval > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(self, args)
      if (!timeout) self = args = null
    } else if (!timeout && options.trailing !== false) {
      // 差值没到的时候，离开时需要执行则走这里
      timeout = setTimeout(later, interval)
    }
  }
  return throttled
}
```
