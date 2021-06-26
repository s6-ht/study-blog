# 浏览器面试合集


https://juejin.cn/post/6854573215830933512#heading-65

#### 2. 解决跨域的方式？
http://47.98.159.95/my_blog/blogs/net/http/014.html#%E4%BB%80%E4%B9%88%E6%98%AF%E8%B7%A8%E5%9F%9F
#### 3. 浏览器的事件循环机制？
https://segmentfault.com/a/1190000012925872
https://juejin.cn/post/6961349015346610184?utm_source=gold_browser_extension
#### 4. 浏览器缓存？
#### 5. XSS攻击？
#### 6. crsf攻击？
#### 9. 浏览器工作原理？
https://www.infoq.cn/article/CS9-WZQlNR5h05HHDo1b
#### 9. 重绘和回流？
http://47.98.159.95/my_blog/blogs/browser/browser-render/004.html#gpu%E5%8A%A0%E9%80%9F%E7%9A%84%E5%8E%9F%E5%9B%A0
#### 10. 从输入url到页面呈现发什么什么？
构建请求、查找强缓存、dns解析(浏览器缓存/本地缓存/host/dns服务器)、tcp连接(并发连接限制/域名分片)、发送http请求(get/和post发送的区别)、服务器响应请求（响应完成如果不是keep-alive则断开连接）、浏览器解析（构建dom树、样式计算、生成布局树）、渲染
http://47.98.159.95/my_blog/blogs/browser/browser-render/003.html#%E4%B8%80%E3%80%81%E5%BB%BA%E5%9B%BE%E5%B1%82%E6%A0%91

http://www.dailichun.com/2018/03/12/whenyouenteraurl.html


浏览器渲染进程包括以下线程：
GUI线程

JS引擎线程

事件触发线程

定时器线程

网络请求线程