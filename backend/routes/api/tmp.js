// let str="jfkldsjalk,.23@#!$$k~!  @#$%^&*()(_+-=|\{}[]';:,./<>??gg  g~```gf"; 
//     str=str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,""); 
// console.log(str)

// 做前后端接口
const Router = require("koa-router");
const router = new Router();
const axios = require("axios");
router.post("/bilibili", async ctx => { 
  ctx.status = 200;  // 服务器响应成功
  let search = ctx.request.body.search; // 拿 post 字段
  // console.log("搜索电影：" + search);
  // const key = encodeURIComponent(search + "影评");
  // const page = await axios({
  //   method: "get",
  //   url: `https://api.bilibili.com/x/web-interface/search/all?jsonp=jsonp&highlight=1&keyword=${key}&single_column=-1`,
  //   headers: {
  //     DNT: 1,
  //     Referer: `https://search.bilibili.com/all?keyword=${key}`,
  //     "sec-ch-ua": "Google Chrome 74",
  //     "Sec-Fetch-Dest": "script",
  //     "Sec-Fetch-Mode": "no-cors",
  //     "Sec-Fetch-Site": "same-site",
  //     "Sec-Fetch-User": "?F",
  //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36"
  //   }
  // });
  // const obj = await page.data;
  // let video = obj.data.result.video;
  // let iframeURL = [];
  // video.forEach(e => {
  //   iframeURL.push(`https://player.bilibili.com/player.html?aid=${e.aid}`);
  // });
  ctx.body = iframeURL; // 你函数不管怎么复杂  最后返回参数传给 CTX.BODY
});

module.exports = router;