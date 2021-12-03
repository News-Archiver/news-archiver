const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const url = "http://edition.cnn.com/article/sitemap-2021-12.html";

const extractLinks = ($) => [
  ...new Set(
    $(".sitemap-link a")
      .map((_, a) => $(a).attr("href"))
      .toArray()
  ),
];

axios.get(url).then(({ data }) => {
  const $ = cheerio.load(data);
  const links = extractLinks($);

  console.log(links);
});
