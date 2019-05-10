const Router = require('koa-router');
const router = new Router();

/**
 *  @Router  POST /api/analysis/analysis
 *  
 */
router.post('/analysis', async ctx => {
  // ... 逻辑代码
  // 前端发送 post 请求 发送数据是京东URL，这里接收数据
  const dogURL = ctx.request.body.dogURL
  const filter = () => {
  }
  ctx.body = {
    // 响应后传回参数 
    // data
    msg: '分析后的词'
  }
})
module.exports = router;
