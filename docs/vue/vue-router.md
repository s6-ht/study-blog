# vue-router 相关
通过hash、history和abstract实现前端路由，更新视图但是不重新发送请求。其实是在内部创建了一个路由映射表，当url变化的时候，去映射表中进行匹配，匹配到了之后，调用vue中的_render方法，开始渲染dom。

### hash
- 当向服务器发出请求的时候，hash不会被带上；
- hash值的改变，都会在浏览器的访问历史上增加记录，因此点击前进、后退按钮都能返回到响应的页面；
- 通过监听hashChange时间来监听hash的变化。

### history
其中有两个api, pushState和replaceState， 可以在浏览器不刷新的情况下，操作浏览器历史记录。使用popState来监听url的变化。
pushState和replaceState不会触发popState事件。
