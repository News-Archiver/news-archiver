const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

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

const subMonthsLink = (link) => {
  const fullYearLink = baseURL + link;

  return axios.get(fullYearLink).then(async ({ data }) => {
    const $ = cheerio.load(data);
    const yearMonthLink = await extractMonthsLink($);

    for (var i = 0; i < yearMonthLink.length; i++) {
      const fullMonthLink = baseURL + yearMonthLink[i]["link"];
      await callExtractContent(fullMonthLink, yearMonthLink[i]["month"]);
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

axios.get(yearURL).then(async ({ data }) => {
  const $ = cheerio.load(data);

  const yearShortLinks = await extractYearPage($);

  for (var i = 0; i < yearShortLinks.length; i++) {
    const yearFullLinks = yearShortLinks[i]["year_link"];
    await subMonthsLink(yearFullLinks);
  }
});

const getImage = ($) =>
  $(".l-container")
    .map((_, product) => {
      const $product = $(product);
      return {
        img: `https:${$product.find("img").attr("data-src-large")}`,
      };
    })
    .toArray();

async function downloadImage(link) {
  console.log(link);
  if (link === "https:undefined") return;
  const url = link;
  const fileName = path.basename(link);
  const dir = path.resolve(__dirname, fileName);
  const writer = fs.createWriteStream(dir);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

const callExtractContent = (link, month) => {
  return axios.get(link).then(async ({ data }) => {
    const $ = cheerio.load(data);
    let save = await extractContent($, month);
    let reg = /("|'|`)/gm;

    for (let i = 0; i < save.length; i++) {
      let { link } = save[i];

      await axios.get(link).then(async ({ data }) => {
        const $ = cheerio.load(data);
        const content = await getImage($);
        await downloadImage(content[0].img);
      });
    }
  });
};
