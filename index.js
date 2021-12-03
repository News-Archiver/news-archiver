const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const url = "http://edition.cnn.com/article/sitemap-2021-12.html";

const extractDate = ($) => [
  $(".date")
    .map((_, a) => $(a).text())
    .toArray(),
];

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
  const dates = extractDate($);

  console.log(links);
  console.log(dates);
});
