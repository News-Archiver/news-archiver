const axios = require("axios");
const cheerio = require("cheerio");
const prompt = require("prompt-sync")({ sigint: true });

const url = prompt("URL: ");

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

axios
  .get(url)
  .then(async ({ data }) => {
    let imgLink, imgAlt;
    const $ = cheerio.load(data);
    const content = await getImage($);

    if (content.length === 0) {
      imgLink = "https:undefined";
      imgAlt = "undefined";
    } else {
      imgLink = content[0].img;
      imgAlt = content[0].alt;
    }

    if (imgLink === "https:undefined") {
      imgAlt = "undefined";
    }
    console.log(imgLink, imgAlt);
  })
  .catch((error) => {
    if (
      error.response.status === 500 &&
      error.response.statusText === "Internal Server Error"
    ) {
      return;
    }
  });
