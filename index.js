const axios = require("axios");
const cheerio = require("cheerio");

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

const url = "https://edition.cnn.com";
axios.get(url).then(({ data }) => {
  const $ = cheerio.load(data); // Initialize cheerio
  const content = extractContent($);

  console.log(content);
});
