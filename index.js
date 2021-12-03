const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const url = "https://edition.cnn.com";

const extractContent = ($) =>
  $(".cd__content")
    .map((_, product) => {
      const $product = $(product);
      console.log($product);
      return {
        title: $product.find("span").text(),
      };
    })
    .toArray();

https.get(url, (res) => {
  var chunks = [];
  res.on("data", onGotData);
  res.on("end", onEnd);

  function onGotData(chunk) {
    chunks.push(chunk);
  }

  function onEnd() {
    console.log(chunks.join(""));
  }
});

axios.get(url).then(({ data }) => {
  const $ = cheerio.load(data);
  const content = extractContent($);

  // console.log(content);
});
