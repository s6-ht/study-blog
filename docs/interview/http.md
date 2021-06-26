# http 面试题合集

#### 1. TCP三次握手和四次挥手？
TCP规定，SYN=1的报文段不能携带数据，但需要消耗掉一个序号。
SYN：同步序列编号，当SYN = 1 ACK = 1时，表明是连接请求报文，若同意连接，则相应报文中SYN = 1 ACK = 1。
ACK：当ACK = 1时，确认号字段才有效。
FIN：用来释放连接。当FIN = 1，表明此报文的发送方的数据已经发送完毕，并且要求释放。
seq: 序列号
ack：确认号
https://blog.csdn.net/qzcsu/article/details/72861891
https://juejin.cn/post/6844903958624878606
四次挥手
释放连接的时候也是如此：客户端发起关闭连接的请求，关闭连接意味着客户端结束了自己的工作即发送数据，但此时仍然处于数据传输的过程中，服务器可能未数据传输完毕，因此当请求到服务器时服务器知道了这个请求，但服务器数据传输未完成无法关闭连接，因此服务器先发送一个ack告诉客户端关闭请求已收到，但老子正忙，一会再关，你再等一会。等服务器工作完成了，就把fin信号发送给客户端，此时服务器要等着客户端给他一个回信，让服务器知道客户端已经知道了。因此客户端收到后就给服务器一个回信，为了防止回信丢失，客户端就再等2MSL个时间，之所以是2个，是因为涉及到来回，第一个MSL中是回信在路上的最大时间，第二个MSL是万一回信没到服务端，服务端重发的FIN确认在路上的时间（不知道这样理解对不对）
http://47.98.159.95/my_blog/blogs/net/tcp/003.html#%E8%BF%87%E7%A8%8B%E6%8B%86%E8%A7%A3
#### 1. TCP和UDP的区别？
#### 2. https 加密？
#### 3. https工作原理？
https://juejin.cn/post/6844903821420789767#heading-5

#### get和Post的区别
http://47.98.159.95/my_blog/blogs/net/http/002.html#get-%E5%92%8C-post-%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB
#### 1. 常见状态码？
http://47.98.159.95/my_blog/blogs/net/http/004.html#_1xx
#### http1.1 如何解决对头阻塞问题？
http://47.98.159.95/my_blog/blogs/net/http/010.html#%E4%BB%80%E4%B9%88%E6%98%AF-http-%E9%98%9F%E5%A4%B4%E9%98%BB%E5%A1%9E
#### 2. cookie？
http://47.98.159.95/my_blog/blogs/net/http/011.html
#### 1. http2 从哪些方面做了优化？
头部压缩：https://juejin.cn/post/6844903734670000142
服务器推送：https://www.infoq.cn/article/qydn85t4g4dl4vbae3n2
http://47.98.159.95/my_blog/blogs/net/http/017.html#%E5%A4%B4%E9%83%A8%E5%8E%8B%E7%BC%A9

#### https的握手过程？
http://www.dailichun.com/2018/03/12/whenyouenteraurl.html