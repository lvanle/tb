# 京东商品查询
- 前端 VUE.js
  - 使用 Axios 实现前后端 XHR 请求。
  - 将用户信息存储在 VUEX 中使得用户 Token 可以用在任何一个组件之中。
- 后端 koa + MongoDB
  - 通过 jsonWebToken 把用户名称，手机号，邮箱等隐藏为一个 Token，前端解析 Token 后返回用户的姓名，手机号，邮箱，头像
  - 使用 bcryptjs 将用户密码加密，存入数据库中
  - 通过 koa/cors 实现AJAX 跨域请求
  - 解析京东评论文字乱码问题
    1. 首先是请求头 `encoding:null` 将请求数据转为二进制
    2. 其次是将数据通过 iconv-lite 转码为 GB2312
- 技术栈 axios nodejieba
## 使用
1.  前端用法
```
cd frontend
npm run serve 
```
2. 后端用法
```
cd backend
nodemon
```
