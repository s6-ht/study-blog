# vuex
vuex是vue的一个状态管理仓库，集中式的管理数据状态。state和getters对状态进行定义；actions和mutations对状态进行变更，同时引入module进行模块化分割。
vuex的本质其实就是一个没有template的隐藏这的vue组件。如下，其实就是将state放到了一个新组件的data中，然后借助vue的响应式系统，使其能够实现双向绑定。
```javascript
function resetStoreVM (store, state, hot) {
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
}
```