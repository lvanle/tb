// 用户注册登录
const Router = require("koa-router");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("koa-passport");
const secrtKey = require("../../config/keys").secretOrKey;
const router = new Router(); // 实例化 router
const User = require("../../models/User"); // 引入数据模型
const tools = require("../../config/tools");
const validationRegisterInput = require("../../validation/register");  //引入验证
const validationLoginInput = require("../../validation/login");
/**
 * @route  GET /api/users/test
 * @desc   测试接口地址
 * @access 接口公开
 */
router.get("/test", async ctx => {
  ctx.status = 200;
  ctx.body = { msg: "用户登陆成功" };
});
/**
 * @route  POST /api/users/register
 * @desc   注册接口地址
 * @access 接口公开
 */
router.post("/register", async ctx => {
  const{errors,isValid} = validationRegisterInput(ctx.request.body);
  //判断是否验证通过
  if(!isValid){
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  // 使用 koa-bodyparser 把前端数据传到后端 在app引入
  // 前端到数据库 => 注册前先查询是否存在用户
  const findResult = await User.find({ email: ctx.request.body.email });
  if (findResult.length > 0) {
    //用户存在并已经注册
    ctx.status = 500;
    ctx.body = { email: "邮箱已经被占用" };
  } else {
    let avatar = gravatar.url("ctx.request.body.email", { s: "400", r: "pg", d: "mm" });  //mm 默认的头像
    const newUser = new User({
      name: ctx.request.body.name,
      avatar,
      email: ctx.request.body.email,
      password: tools.encrypt(ctx.request.body.password),
      phone: ctx.request.body.phone
    });
    //存到数据库
    newUser
      .save()
      .then(user => {
        ctx.body = user;
      })
      .catch(err => {
        console.log(err);
      });
    ctx.body = newUser;
  }
});
/**
 * @route  POST /api/users/login
 * @desc   登录接口地址 返回token
 * @access 接口公开
 */
router.post("/login", async ctx => {
  //查询数据库中邮箱是否在
  const{errors,isValid} =validationLoginInput(ctx.request.body);
  //判断是否验证通过
  if(!isValid){
    ctx.status=500;
    ctx.body =errors;
    return;
  }
  const findResult = await User.find({ email: ctx.request.body.email });
  const user = findResult[0];
  const password = ctx.request.body.password; // 获取响应数据密码
  if (findResult.length == 0) {
    ctx.status = 404;
    ctx.body = { email: "用户不存在!" };
  } else {
    //查到之后验证密码
    let result = await bcrypt.compareSync(password, user.password);
    if (result) {
      // 返回token
      const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone
      };
      const token = jwt.sign(payload, secrtKey, { expiresIn: 3600 });
      ctx.status = 200;
      ctx.body = { success: true, token: `Bearer ${token}` }; // token这里的值是固定的 Bearer[空格][token]三个部分
    } else {
      ctx.status = 400;
      ctx.body = { password: "密码错误" };
    }
  }
});
/**
 * @route  GET /api/users/current
 * @desc   用户信息接口地址 返回用户信息
 * @access 接口私有
 */
router.get("/current", passport.authenticate("jwt", { session: false }), async ctx => {
  //这里调用了passport所以 return 结果在这里
  ctx.body = {
    id: ctx.state.user.id,
    email: ctx.state.user.email,
    avatar: ctx.state.user.avatar,
    name: ctx.state.user.name,
    phone: ctx.state.user.phone
  };
});
module.exports = router;
