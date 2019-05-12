const Router = require("koa-router");
const router = new Router();
const productData = require("./productData");
const positiveDict = require("../../models/positive_dic");
const negativeDict = require("../../models/negative_dic");
const jieba = require("nodejieba");
/**
 *  @Router  POST /api/analysis/analysis
 *
 */
router.post("/analysis", async ctx => {
  // 前端发送 post 请求 发送数据是京东URL，这里接收数据
  const dogURL = await ctx.request.body.dogURL;
  const productId = await dogURL.match(/\d+/g)[0];
  // 爬虫获取京东URL的productId后传给爬虫做网络请求；
  // 网络请求结束后数据传给结巴分词，对评论进行 过滤、分词、判断情感值
  function fake_resquest() {
    // TODO: 爬虫中文乱码
    return productData.comments; // 返回数据 数组类型
  }
  let commentsData = fake_resquest(); // 实例化数据
  function filteData(productData) {
    // 传进来取名叫 productData
    let comments = [];
    productData.forEach(e => {
      sentence = e.content;
      let filterStep1 = sentence.replace(/[\ |\~|\，|\。|\（|\）|\`|\!+|\！+|\；|\％|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\：|\"|\'|\,|\<|\.|\>|\/|\?+|\d|(A-Z)|(a-z)]|！\\n|\～+/g, "");
      comments.push(filterStep1);
    });
    let positiveRes;
    comments.forEach(e => {
      let result = jieba.extract(e, 1000); // 从文本中抽取
      let tagList = positiveDict; // 自定义词库
      positiveRes = result.filter(item => tagList.indexOf(item.word) >= 0);
    });
    console.log(positiveRes);
    let negativeRes;
    comments.forEach(e => {
      let result = jieba.extract(e, 1000);
      let tagList = negativeDict;
      negativeRes = result.filter(item => tagList.indexOf(item.word) >= 0);
    });
    console.log(negativeRes);
    return {
      comments,
      positiveRes,
      negativeRes
    };
  }
  let result = filteData(commentsData);
  ctx.status = 200;
  ctx.body = {
    // 响应后传回参数
    // data,
    productId,
    dogURL,
    result
  };
});
module.exports = router;
