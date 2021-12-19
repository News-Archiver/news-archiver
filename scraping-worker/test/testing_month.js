const axios = require("axios");
const cheerio = require("cheerio");
const prompt = require("prompt-sync")({ sigint: true });

const getImage = ($) =>
  $(".l-container")
    .map((_, product) => {
      const $product = $(product);
      return {
        img: `https:${$product.find("img").attr("data-src-small")}`,
        alt: $product.find("img").attr("alt"),
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

const callExtractContent = (link, month) => {
  return axios.get(link).then(async ({ data }) => {
    const $ = cheerio.load(data);
    let save = await extractContent($, month);
    let reg = /("|'|`)/gm;

    for (let i = 0; i < save.length; i++) {
      let { headline, link, date, month } = save[i];
      let imgLink, imgAlt;
      headline = headline.replace(reg, "'");
      link = link.replace(reg, "'");
      date = date.replace(reg, "'");
      month = month.replace(reg, "'");

      console.log(`Link ${link}`);
      await axios
        .get(link)
        .then(async ({ data }) => {
          const $ = cheerio.load(data);
          const content = await getImage($);
          if (content.length === 0) {
            imgLink = "https:undefined";
            imgAlt = "undefined";
          } else {
            imgLink = content[0].img;
            imgAlt = content[0].alt;
          }
        })
        .catch((error) => {
          if (
            error.response.status === 500 &&
            error.response.statusText === "Internal Server Error"
          ) {
            return;
          }
        });

      var sql = `INSERT INTO cnn (headline, link, date, month, imglink, imgalt) VALUES ("${headline}", "${link}", "${date}", "${month}", "${imgLink}", "${imgAlt}");`;
      console.log(sql);
    }
  });
};

const url = prompt("URL: ");
callExtractContent(url, "December");
