const axios = require("axios");
(async () => {
  const productId = "100002928171";
  axios.interceptors.response.use(response => {
    response.headers = {
      age: 0,
      "content-encoding": "gzip",
      "content-type": "application/json;charset=GBK",
      date: "Tue, 07 May 2019 15:17:52 GMT",
      server: "JDWS/2.0",
      status: 200,
      via: "BJ-Y-NX-112(MISS), http/1.1 JN-UNI-1-JCS-32 ([cMsSf])"
    };
    return response;
  });
  await axios({
    method: "GET",
    url: `https://sclub.jd.com/comment/productPageComments.action`,
    params: {
      productId,
      score: 0,
      sortType: 5,
      page: 0,
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
    }
  }).then(res => console.log(res.data));
})();
