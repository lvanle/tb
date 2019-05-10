const axios = require("axios");
(async url => {
  let productID = "7652013"; // TODO: 网页链接正则匹配 -> 产品ID号码
  const data = await axios({
    method: "get",
    url: `https://sclub.jd.com/comment/productPageComments.action&productId=${productID}&score=0&sortType=5&page=0&pageSize=10&isShadowSku=0&fold=1`,
    headers: {
      DNT: 1,
      Referer: `https://item.jd.com/${productID}.html`,
      "sec-ch-ua": "Google Chrome 74",
      "Sec-Fetch-Dest": "script",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "same-site",
      "Sec-Fetch-User": "?F",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36"
    }
  });
  const data = await data.data
})("https://item.jd.com/7652013.html"); // 网页链接入口
