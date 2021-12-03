const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const url = "http://edition.cnn.com/article/sitemap-2021-11.html";

const extractContent = ($) =>
  $(".sitemap-entry").find('ul > li')
    .map((_, product) => {
      const $product = $(product);
      const link = $product.find("a");
      return {
        link: link.attr("href"),
        date: $product.find('span[class="date"]').text(),
        headline: link.text(),
      };
    })
    .toArray();

axios.get(url).then(({ data }) => {
  const $ = cheerio.load(data);
  const content = extractContent($);
  console.log(content);
});
