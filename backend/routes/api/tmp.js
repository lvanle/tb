router.post("/analysis", async ctx => {
  // 前端发送 post 请求 发送数据是京东URL，这里接收数据
  const dogURL = await ctx.request.body.dogURL;
  const productId = await dogURL.match(/\d+/g)[0];
  const pagenum = await ctx.request.body.page;
  const page = parseInt(pagenum);
  if (dogURL == "") {
    ctx.status = 500;
    ctx.body = { msg: "不能为空" };
  } else {
    // 爬虫获取京东URL的productId后传给爬虫做网络请求；
    // 网络请求结束后数据传给结巴分词，对评论进行 过滤、分词、判断情感值
    async function reAction() {
      // let productId =await productId;
      return new Promise((res, rej) => {
        request(
          {
            url: "https://sclub.jd.com/comment/productPageComments.action",
            method: "GET",
            qs: {
              productId,
              score: 0,
              sortType: 5,
              page,
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
    const loop = async () => {
      let str = await reAction();
      let data = JSON.parse(str);
      return data.comments;
    };
    let commentsData = await loop();

    async function filteData(productData) {
      // console.log(productData);
      // 传进来取名叫 productData
      let comments = [];
      await productData.forEach(e => {
        sentence = e.content;
        let filterStep1 = sentence.replace(/[\ |\~|\，|\。|\（|\）|\`|\!+|\！+|\；|\％|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\：|\"|\'|\,|\<|\.|\>|\/|\?+|\d|(A-Z)|(a-z)]|！\\n|\～+/g, "");
        comments.push(filterStep1);
      });
      //
      // ─── POSITIVE ────────────────────────────────────────────────────
      //
      let positiveList,
        positiveRes = [];
      await comments.forEach(e => {
        let result = jieba.extract(e, 1000); // 从文本中抽取
        let tagList = positiveDict; // 自定义词库
        positiveList = result.filter(item => tagList.indexOf(item.word) >= 0);
        positiveList.forEach(e => positiveRes.push(e)); // 二维数组拍平
      });
      let _objPosi = {};
      let positiveData = positiveRes.reduce((prev, curr) => {
        _objPosi[curr.word] ? true : (_objPosi[curr.word] = true && prev.push(curr));
        return prev;
      }, []);
      console.log(positiveData);
      console.log(`褒义词个数：${positiveData.length}`);
      //
      // ─── NEGATIVE ────────────────────────────────────────────────────────
      //
      let negativeList,
        negativeRes = [];
      await comments.forEach(e => {
        let result = jieba.extract(e, 1000);
        let tagList = negativeDict;
        negativeList = result.filter(item => tagList.indexOf(item.word) >= 0);
        negativeList.forEach(e => negativeRes.push(e)); // 二维数组拍平
      });
      let _objNega = {};
      let negativeData = negativeRes.reduce((prev, curr) => {
        _objNega[curr.word] ? true : (_objNega[curr.word] = true && prev.push(curr));
        return prev;
      }, []);
      console.log(`贬义词个数：${negativeData.length}`);
      return {
        comments,
        positiveData,
        _posilength: positiveData.length,
        negativeData,
        _negalength: negativeData.length
      };
    }
    let result = await filteData(commentsData);
    ctx.status = 200;
    ctx.body = {
      productId,
      dogURL,
      result
    };
  }
});
