const productData = require("./productData");
const positiveDict = require("../../models/positive_dic");
const negativeDict = require("../../models/negative_dic");
const axios = require("axios");
const Router = require("koa-router");
const router = new Router();
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
  let defaultInfo = {
    url: "https://sclub.jd.com/comment/productPageComments.action",
    headers: {
      DNT: 1,
      Referer: `https://item.jd.com/${productId}.html`,
      "sec-ch-ua": "Google Chrome 74",
      "Sec-Fetch-Dest": "script",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "same-site",
      "Sec-Fetch-User": "?F",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36"
    },
    params: {
      productId,
      score: 0,
      sortType: 5,
      page: 0,
      pageSize: 10,
      isShadowSku: 0,
      fold: 1
    }
  };
  async function fake_resquest() {
    // TODO: 爬虫中文乱码
    let productData = await axios({
      method: "get",
      url: defaultInfo.url,
      params: defaultInfo.params,
      headers: defaultInfo.headers
    }).then(e => e);
    return productData.data.comments; // 返回数据 数组类型
  }
  let commentsData = await fake_resquest(); // 实例化数据
  async function filteData(productData) {
    // 传进来取名叫 productData
    let comments = [];
    await productData.forEach(e => {
      sentence = e.content;
      let filterStep1 = sentence.replace(/[\ |\~|\，|\。|\（|\）|\`|\!+|\！+|\；|\％|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\：|\"|\'|\,|\<|\.|\>|\/|\?+|\d|(A-Z)|(a-z)]|！\\n|\～+/g, "");
      comments.push(filterStep1);
    });
    let positiveRes;
    await comments.forEach(e => {
      let result = jieba.extract(e, 1000); // 从文本中抽取
      let tagList = positiveDict; // 自定义词库
      positiveRes = result.filter(item => tagList.indexOf(item.word) >= 0);
    });
    console.log(positiveRes);
    let negativeRes;
    await comments.forEach(e => {
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
  let result = await filteData(commentsData);
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
