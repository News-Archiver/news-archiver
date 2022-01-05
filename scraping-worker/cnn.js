const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql");
const axiosCache = require("axios-cache-adapter");

const baseURL = "https://edition.cnn.com";
const sitemapURL = `${baseURL}/sitemap.html`;

const cache = axiosCache.setupCache({
  maxAge: 15 * 60 * 1000,
});

const api = axios.create({
  adapter: cache.adapter,
});

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
                        imglink TEXT,
                        imgalt TEXT
                    )`;

  connection.query(createCNN, function (err) {
    if (err) {
      console.log(err.message);
    }
  });
});

const getYearLinks = ($) =>
  // This function is going through https://edition.cnn.com/sitemap.html ("Articles by Year")
  // And returning back a URL -> https://edition.cnn.com/article/sitemap-2011.html (2011 to current year)
  $(".sitemaps-year-listing")
    .find("div:nth-child(1) > ul > li")
    .map((_, product) => {
      const $product = $(product);
      return {
        year_link: `${baseURL}${$product.find("a").attr("href")}`,
      };
    })
    .toArray();

async function saveToDB(headline, link, date, month, imgLink, imgAlt) {
  var sql = `INSERT INTO cnn (headline, link, date, month, imglink, imgalt) VALUES (${connection.escape(headline)}, ${connection.escape(link)}, ${connection.escape(date)}, ${connection.escape(month)}, ${connection.escape(imgLink)}, ${connection.escape(imgAlt)});`;
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

async function getArticleLinkFromDB() {
  let sql = "SELECT link FROM news.cnn;";

  return await new Promise((resolve, reject) => {
    connection.query(sql, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}

async function getArticlesLinksFromDB() {
  const articlesLinks = await getArticleLinkFromDB();
  const articlesLinksFromDB = articlesLinks.map(
    (articleLink) => articleLink.link
  );
  return articlesLinksFromDB;
}

async function getImgAndAlt(pageLink) {
  let imgLink, imgAlt;
  await axios
    .get(pageLink)
    .then(async ({ data }) => {
      const $ = cheerio.load(data);
      const content = await getImageFromParticularArticle($);

      if (content.length === 0) {
        imgLink = "https:undefined";
        imgAlt = "undefined";
      } else {
        imgLink = content[0].img;
        imgAlt = content[0].alt;

        if (imgLink === "https:undefined") {
          for (let i = 0; i < content.length; i++) {
            imgLink = content[i].img;
            imgAlt = content[i].alt;

            if (imgLink !== "https:undefined") break;
          }

        }
      }

      if (imgLink === "https:undefined") imgAlt = "undefined";
    })
    .catch((error) => {
      console.log(error);
      return;
    });
  return { imgLink, imgAlt };
}

const enterArticlePage = (monthLink, month) => {
  return api({
    url: `${monthLink}`,
    method: "get",
  }).then(async ({ data }) => {
    const $ = cheerio.load(data);
    const articles = await getArticlesHeadlines($, month);

    const articlesLinksFromDB = await getArticlesLinksFromDB();

    for (let i = 0; i < articles.length; i++) {
      let { headline, pageLink, date, month } = articles[i];

      const isDuplicateLink = articlesLinksFromDB.some(
        (element) => element === pageLink
      );
      if (isDuplicateLink) continue;

      let { imgLink, imgAlt } = await getImgAndAlt(pageLink);

      await saveToDB(
        headline,
        pageLink,
        date,
        month,
        imgLink,
        imgAlt
      );
    }
  });
};

const getMonthsFromYearPage = (yearLink) => {
  // https://edition.cnn.com/article/sitemap-2011.html this link contain all the months inside that particular year
  return axios.get(yearLink).then(async ({ data }) => {
    const $ = cheerio.load(data);
    const monthsLinks = await getMonthsLinksFromYearPage($);

    let promises = [];
    for (var i = 0; i < monthsLinks.length; i++) {
      promises.push(
        enterArticlePage(monthsLinks[i]["link"], monthsLinks[i]["month"])
      );
    }
    await Promise.all(promises);
  });
};

const getMonthsLinksFromYearPage = ($) =>
  // This function get link -> https://edition.cnn.com/article/sitemap-2011-8.html (2011-8 is August of 2011)
  $(".sitemap-month")
    .find("li")
    .map((_, product) => {
      const $product = $(product);
      const link = $product.find("a");
      return {
        link: `${baseURL}${link.attr("href")}`,
        month: link.text(),
      };
    })
    .toArray();

const getArticlesHeadlines = ($, month) =>
  $(".sitemap-entry")
    .find("ul > li")
    .map((_, product) => {
      const $product = $(product);
      const link = $product.find("a");
      return {
        pageLink: link.attr("href"),
        date: $product.find('span[class="date"]').text(),
        headline: link.text(),
        month: month,
      };
    })
    .toArray();

const getImageFromParticularArticle = ($) =>
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
  .get(sitemapURL)
  .then(async ({ data }) => {
    const $ = cheerio.load(data);
    const yearlinks = await getYearLinks($);

    for (var i = 0; i < yearlinks.length; i++) {
      const yearLink = yearlinks[i]["year_link"];
      await getMonthsFromYearPage(yearLink);
    }

    connection.end();
    process.exit();
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.stack : error);
    process.exit(1);
  });
