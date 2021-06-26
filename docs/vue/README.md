# Vue源码解读

#### 源码调试方法
- clone vue源码到本地，然后进入根目录，执行`yarn install`
- 安装完成后执行`yarn dev`
- 在example目录下建一个demo, 引入`dist/vue.js`文件
- 此时，就可以实时调试vue源码了

注意：在执行`yarn dev`的过程中可能遇到这个错误：`fsevents is not a constructor`, 这是由于`chokidar`模块没有被安装成功，可单独安装以下这个模块。


#### 当v-model上绑定了一个不能够在当前组件修改的值时，应该怎么做？
假如此时`v-model = obj.message`, 此时这个message是通过vuex传递过来的或者父组件传递过来的，那么这种情况下，我们直接在input中输入值后，这个值就会被改变，但是其实这样就破坏了单向数据流，那应该怎么实现呢？
1. 定义一个局部变量message, 然后监听message, 当值改变时向父组件或者vuex触发方法
2. 定义一个计算属性message, 重写该属性的get和set方法：
```javascript
computed: {
  message: {
    get() {
      return this.$store.state.obj.message
    },
    set(val) {
      this.$store.commit('updateMessage', val)
    }
  }
}
```
> 如果为父子组件时可以使用`this.$emit('update:obj.message', message)`