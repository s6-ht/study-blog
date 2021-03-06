# CSRF攻击

#### 什么是CSRF攻击？
跨站请求伪造（Cross Site request forgery）简称CSRF，指黑客诱导用户进入第三方网站，利用用户已经登录的状态，在第三方网站中向被攻击网站发起请求，从而绕过后台验证。

一种常见的CSRF攻击的流程如下：
- 受害者登录了`a.com`， 并保存了该网站的cookie；
- 黑客诱导受害者进入b.com；
- b.com向a.com发送一个请求：a.com/act=xxx，**浏览器会默认带上a.com的cookie**；
- a.com接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求；
- a.com以受害者的名义执行了act=xx；
- 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作。


#### CSRF特性
- 攻击一般发生在第三方网站，而不是被攻击网站
- 攻击者利用用户登录凭证，冒充受害者操作，而不是窃取信息；
- 整个过程中攻击者并不能拿到受害者的凭证，只是冒用；

#### CSRF攻击的常见方式
1. 自动get请求

点开第三方网站后，网站中有一个图片请求，请求地址就是被攻击网站的服务端地址，因为用户已经登录过被攻击网站，所以请求时会自动带上被攻击网站的cookie；

2. 自动发送post请求

第三方网站中有一个表单，表单的提地址也是被攻击网站的服务端地址，同get请求

3. 链接类型的CSRF

就是诱导用户点击某个链接，从而发送请求。

#### 预防措施

1. 阻止不明外域的访问
  - 同源检测
  - Samesite Cookie
2. 提交时要求附加本域才能获取的信息
  - CSRF Token
  - 双重Cookie验证

- 同源检测
在http请求中，每一个异步请求都会携带两个Header：origin和referer。在发起请求时，一般会被自动带上，并且不能由前端自定义。因此可以根据这两个字段，在服务端确定请求域的来源。

但是它们可能存在都不存在或者不可信的情况，因此可能安全性略差。
- 从https跳转到http时, Referer不存在
- 点击flash跳转时，referer比较杂乱

- Samesite属性
CSRF攻击的核心就是攻击者冒用了受害者的登录凭证cookie， 因此可以使用该属性对网站的cookie做一些限制。SameSite包括三个值：`Strict、Lax、None`，详细如下：
  - Strict：浏览器完全禁止第三方请求携带`cookie`。比如请求sanyuan.com网站只能在sanyuan.com域名当中请求才能携带 Cookie，在其他网站请求都不能。
  - Lax：只能在 get 方法提交表单况或者a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。
  - None：在None模式下，也就是默认模式，请求会自动携带上 Cookie。

- CSRF Token

该方式的流程如下：
  - 首先，浏览器向服务器发送请求时，服务器生成一个字符串，将其植入到返回的页面中。
  - 然后浏览器如果要发送请求，就必须带上这个字符串，然后服务器来验证是否合法，如果不合法则不予响应。这个字符串也就是CSRF Token，通常第三方站点无法拿到这个 token, 因此也就是被服务器给拒绝。

- 双重Cookie

双重Cookie采用以下流程：

在用户访问网站页面时，向请求域名注入一个Cookie，内容为随机字符串（例如csrfcookie=v8g9e4ksfhw）。
在前端向后端发起请求时，取出Cookie，并添加到URL的参数中（接上例POST https://www.a.com/comment?csrfcookie=v8g9e4ksfhw）。
后端接口验证Cookie中的字段与URL参数中的字段是否一致，不一致则拒绝。
