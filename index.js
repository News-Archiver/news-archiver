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

const called = ($, link) => {
  axios.get(link).then(({ data }) => {
    const $ = cheerio.load(data);
    const content = extractContent($);
    // console.log(content);
  });
};

const subMonthsLink = ($, link) => {
  const fullYearLink = baseURL + link;

  axios.get(fullYearLink).then(({ data }) => {
    const $ = cheerio.load(data);
    const yearMonthLink = extractMonthsLink($);

    for (var i = 0; i < yearMonthLink.length; i++) {
      const fullMonthLink = baseURL + yearMonthLink[i]["link"];
      called($, fullMonthLink);
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

// Date : Headline
const extractContent = ($) =>
  $(".sitemap-entry")
    .find("ul > li")
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

axios.get(yearURL).then(({ data }) => {
  const $ = cheerio.load(data);

  // { year_link: '/article/sitemap-2011.html' },
  const yearShortLinks = extractYearPage($);
  console.log(yearShortLinks);

  for (var i = 0; i < yearShortLinks.length; i++) {
    const yearFullLinks = yearShortLinks[i]["year_link"];
    subMonthsLink($, yearFullLinks);
  }
});
