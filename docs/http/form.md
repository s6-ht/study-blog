# http表单提交的两种方式

#### 1. application/x-www-form/urlencoded
使用该种方式提交内容时：参数会被编码成`&`分割的键值对；字符以url形式进行编码。
#### 2. multipart/form-data
实际场景中，文件上传一般使用该方式。使用方式：
```javascript
let formData = new FormData()
formData.append('file', file)
```
注意，使用该方式时，不能设置请求头中的Content-type，浏览器会自动分配（？）。

此时的请求体中的Content-type字段一般是这样：`multipart/form-data; boundary=----WebkitFormBoundaryRRJKeWfHPGrS4LKe`，boundary是分割符的意思，此时数据会被分为多个部分进行传输，每两个部分以boundary字段进行分割，分割符后面加上`--` 表示结束。boundary是浏览器默认指定的。
