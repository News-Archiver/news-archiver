const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const baseURL = "https://edition.cnn.com";
const yearURL = `${baseURL}/sitemap.html`;

const extractYearPage = ($) =>
  $(".sitemaps-year-listing")
    .find("div:nth-child(1) > ul > li")
    .map((_, product) => {
      const $product = $(product);
      return {
        year_link: $product.find("a").attr("href"),
      };
    })
    .toArray();

const callExtractContent = ($, link, month) => {
  axios.get(link).then(({ data }) => {
    const $ = cheerio.load(data);
    const content = extractContent($, month);
    console.log(content);
  });
};

const subMonthsLink = ($, link) => {
  const fullYearLink = baseURL + link;

  axios.get(fullYearLink).then(({ data }) => {
    const $ = cheerio.load(data);
    const yearMonthLink = extractMonthsLink($);

    for (var i = 0; i < yearMonthLink.length; i++) {
      const fullMonthLink = baseURL + yearMonthLink[i]["link"];
      callExtractContent($, fullMonthLink, yearMonthLink[i]["month"]);
    }
  });
};

const extractMonthsLink = ($) =>
  $(".sitemap-month")
    .find("li")
    .map((_, product) => {
      const $product = $(product);
      const link = $product.find("a");
      return {
        link: link.attr("href"),
        month: link.text(),
      };
    })
    .toArray();

const extractContent = ($, month) =>
  $(".sitemap-entry")
    .find("ul > li")
    .map((_, product) => {
      const $product = $(product);
      const link = $product.find("a");
      return {
        link: link.attr("href"),
        date: $product.find('span[class="date"]').text(),
        headline: link.text(),
        month: month,
      };
    })
    .toArray();

axios.get(yearURL).then(({ data }) => {
  const $ = cheerio.load(data);

  const yearShortLinks = extractYearPage($);

  for (var i = 0; i < yearShortLinks.length; i++) {
    const yearFullLinks = yearShortLinks[i]["year_link"];
    subMonthsLink($, yearFullLinks);
  }
});
