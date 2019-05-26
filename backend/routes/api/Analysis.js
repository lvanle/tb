const positiveDict = require("../../models/positive_dic");
const negativeDict = require("../../models/negative_dic");
const Router = require("koa-router");
const router = new Router();
const mongoose = require("mongoose");
const productsDB = require("../../config/keys").mongoProductsUrl;
const Products = require("../../models/Products");
const jieba = require("nodejieba");
const request = require("request");
const iconv = require("iconv-lite");
/**
 *  @Router  POST /api/analysis/analysis
 *
 */
router.post("/scrapy", async ctx => {
  // 前端发送 post 请求 发送数据是京东URL，这里接收数据
  const dogURL = await ctx.request.body.dogURL;
  const productId = await dogURL.match(/\d+/g)[0];
  if (dogURL == "") {
    ctx.status = 500;
    ctx.body = { msg: "链接不可为空" };
  } else {
    ctx.status = 200;
    async function reAction(pageNum, productId) {
      return new Promise((res, rej) => {
        request(
          {
            url: "https://sclub.jd.com/comment/productPageComments.action",
            method: "GET",
            qs: {
              productId,
              score: 0,
              sortType: 5,
              page: pageNum,
              pageSize: 10,
              isShadowSku: 0,
              fold: 1
            },
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
            encoding: null
          },
          (err, response, body) => {
            if (err) {
              console.log(err);
              res(0);
              return;
            }
            body = iconv.decode(body, "gb2312");
            res(body);
          }
        );
      });
    }
    async function formater(pageNum, productId) {
      let str = await reAction(pageNum, productId);
      let data = JSON.parse(str);
      return data;
    }
    async function main(productId) {
      mongoose.createConnection(productsDB, { useNewUrlParser: true }).dropCollection;
      let defaultData = await formater(0, productId);
      let maxPage = defaultData.maxPage;
      let i = 0;
      let Timer = setInterval(async () => {
        const data = await formater(i, productId);
        data.comments.forEach(e => {
          let reg = /\d+-\d+-\d+/g;
          const product = new Products({
            id: e.id,
            nickname: e.nickname,
            userImageUrl: e.userImageUrl,
            comments: e.content,
            rate: e.score,
            referenceTime: e.referenceTime,
            timePick: e.referenceTime.match(reg)[0]
          });
          product.save().catch(e => console.error(e));
        });
        console.log("存储页面：" + i);
        i++;
        if (i > maxPage) {
          clearInterval(Timer);
          console.log("Done");
        }
      }, 1500);
      return {
        maxPage,
        poorCountStr: defaultData.productCommentSummary.poorCountStr,
        generalCountStr: defaultData.productCommentSummary.generalCountStr,
        goodCountStr: defaultData.productCommentSummary.goodCountStr
      };
    }
    let defData = await main(productId);
    ctx.body = {
      defData
    };
  }
});
router.post("/analysis", async ctx => {
  // 把前端选择的时间传过来，这里接受时间
  // 页面上两个picker
  let startDate = ctx.request.body.startDate;
  let endDate = ctx.request.body.endDate;
  let someDate = ctx.request.body.someDate;
  ctx.status = 200;
  let data = await Products.find({ timePick: { $lte: endDate, $gte: startDate } });
  let someDateData = await Products.find({ timePick: someDate });
  let calculator = async () => {
    // someDateData.length  当天评论文人数
    return someDateData.length / data.length;
  };
  let rateCals = await calculator();
  if (data.length == 0) {
    ctx.body = { msg: "这一天没有购买信息" };
  } else {
    async function filterDataMain(data) {
      let comments = await data.map(e => {
        sentence = e.comments;
        let rawSentence = sentence.replace(/[\ |\~|\，|\。|\（|\）|\`|\!+|\！+|\；|\％|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\：|\"|\'|\,|\<|\.|\>|\/|\?+|\d|(A-Z)|(a-z)]|！\\n|\～+/g, "");
        let jiebaRes = jieba.extract(rawSentence, 2000);
        positiveList = jiebaRes.filter(item => positiveDict.indexOf(item.word) >= 0);
        negativeList = jiebaRes.filter(item => negativeDict.indexOf(item.word) >= 0);
        return {
          rawData: e,
          positiveList,
          negativeList,
          posiLength: positiveList.length,
          negaLength: negativeList.length
        };
      });
      return comments;
    }
    let res = await filterDataMain(data);
    async function filterDataSec(data) {
      let comments = await data.map(e => {
        sentence = e.comments;
        let rawSentence = sentence.replace(/[\ |\~|\，|\。|\（|\）|\`|\!+|\！+|\；|\％|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\：|\"|\'|\,|\<|\.|\>|\/|\?+|\d|(A-Z)|(a-z)]|！\\n|\～+/g, "");
        let jiebaRes = jieba.extract(rawSentence, 2000);
        posiLength = jiebaRes.filter(item => positiveDict.indexOf(item.word) >= 0).length;
        negaLength = jiebaRes.filter(item => negativeDict.indexOf(item.word) >= 0).length;
        return { posiLength, negaLength };
      });
      let posiArr = comments.map(e => e.posiLength);
      let posiRate = posiArr.reduce((acc, acu) => acc + acu, 0);
      let negaArr = comments.map(e => e.posiLength);
      let negaRate = negaArr.reduce((acc, acu) => acc + acu, 0);
      let goodRatio = posiRate / posiRate + negaRate;
      return goodRatio;
    }
    let someDay = await filterDataSec(someDateData);
    ctx.body = {
      length: data.length, // 这些天的购买人数
      rateCals: (rateCals * 100).toFixed(2),
      res,
      someDay: `${someDay}%`
    };
  }
});

module.exports = router;
