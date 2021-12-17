const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql");
const path = require("path");
const fs = require("fs");

const baseURL = "https://edition.cnn.com";
const yearURL = `${baseURL}/sitemap.html`;

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "news",
});

connection.connect((err) => {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected!");

  let createCNN = `create table if not exists cnn(
                        id int primary key auto_increment,
                        headline TEXT,
                        link TEXT,
                        date DATE,
                        month TEXT,
                        imglink TEXT
                    )`;

  connection.query(createCNN, function (err) {
    if (err) {
      console.log(err.message);
    }
  });
});

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

const callExtractContent = (link, month) => {
  return axios.get(link).then(async ({ data }) => {
    const $ = cheerio.load(data);
    let save = await extractContent($, month);
    let reg = /("|'|`)/gm;

    for (let i = 0; i < save.length; i++) {
      let { headline, link, date, month } = save[i];
      let imglink;
      headline = headline.replace(reg, "'");
      link = link.replace(reg, "'");
      date = date.replace(reg, "'");
      month = month.replace(reg, "'");

      await axios.get(link).then(async ({ data }) => {
        const $ = cheerio.load(data);
        const content = await getImage($);
        imglink = content[0].img;
        // imglink = await downloadImage(content[0].img);
      });

      console.log(imglink);

      var sql = `INSERT INTO cnn (headline, link, date, month, imglink) VALUES ("${headline}", "${link}", "${date}", "${month}", "${imglink}");`;
      console.log(sql);

      await new Promise((resolve, reject) => {
        connection.query(sql, (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        });
      });
    }
  });
};

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

const getImage = ($) =>
  $(".l-container")
    .map((_, product) => {
      const $product = $(product);
      return {
        img: `https:${$product.find("img").attr("data-src-large")}`,
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
  let deleteDuplicate =
    "DELETE t1 FROM news.cnn t1 INNER JOIN news.cnn t2 WHERE t1.id < t2.id AND t1.link = t2.link;";

  connection.query(deleteDuplicate, function (err) {
    if (err) {
      console.log(err.message);
    }
  });
  connection.end();
  process.exit();
}).catch(error => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
