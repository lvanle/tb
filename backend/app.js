const koa = require("koa");
const Router = require("koa-router");
const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");
const passport = require("koa-passport");
const cors = require("@koa/cors");
//设置数据库
const db = require("./config/keys").mongoUrl;
// 引入user.js
const users = require("./routes/api/users");
const analysis = require('./routes/api/Analysis');
// 实例化对象
const app = new koa();
const router = new Router();
app.use(bodyParser());
//路由
router.get("/", async ctx => {
  ctx.body = { msg: "hello koa app" };
});
// 链接mongodb
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("monogodb connected....."))
  .catch(e => console.log(e));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
// 回调到config文件中
require("./config/passport")(passport);
//配置路由 base 地址,第一个参数是路由地址,第二个参数是路由到用户地址 localhost:5000/api/users/test
router.use("/api/users", users.routes());
// 前端访问这个地址
// localhost:5000/api/analysis/analysis
router.use("/api/analysis", analysis.routes());
// 配置路由
app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server started on ${port}`));
