const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql");

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

async function saveToDB(headline, link, date, month, imgLink, imgAlt) {
    var sql = `INSERT INTO cnn (headline, link, date, month, imglink, imgalt) VALUES ("${headline}", "${link}", "${date}", "${month}", "${imgLink}", "${imgAlt}");`;
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

const callExtractContent = (link, month) => {
    return axios.get(link).then(async ({ data }) => {
        const $ = cheerio.load(data);
        let save = await extractContent($, month);
        let reg = /("|'|`)/gm;

        for (let i = 0; i < save.length; i++) {
            let imgLink, imgAlt;
            let { headline, link, date, month } = save[i];

            headline = headline.replace(reg, "'");
            link = link.replace(reg, "'");
            date = date.replace(reg, "'");
            month = month.replace(reg, "'");

            console.log(`Link ${link}`);

            // with this off
            // after testing remove all the line from 50 to 70
            await axios
                .get(link)
                .then(async ({ data }) => {
                    const $ = cheerio.load(data);
                    const content = await getImage($);
                    // const content = 0;

                    if (content.length === 0) {
                        imgLink = "https:undefined";
                        imgAlt = "undefined";
                    } else {
                        imgLink = content[0].img;
                        imgAlt = content[0].alt;
                    }

                    if (imgLink === "https:undefined") imgAlt = "undefined";
                })
                .catch((error) => {
                    console.log(`ERROR: ${error}`);
                    return;
                });

            var sql = `INSERT INTO cnn (headline, link, date, month, imglink, imgalt) VALUES ("${headline}", "${link}", "${date}", "${month}", "${imgLink}", "${imgAlt}");`;
            console.log(sql);
            // await saveToDB(headline, link, date, month, imgLink, imgAlt);
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
                img: `https:${$product.find("img").attr("data-src-small")}`,
                alt: $product.find("img").attr("alt"),
            };
        })
        .toArray();

async function removeDuplicate() {
    let deleteDuplicate =
        "DELETE t1 FROM news.cnn t1 INNER JOIN news.cnn t2 WHERE t1.id < t2.id AND t1.link = t2.link;";

    await new Promise((resolve, reject) => {
        connection.query(deleteDuplicate, (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
}

axios
    .get(yearURL)
    .then(async ({ data }) => {
        const $ = cheerio.load(data);

        const yearShortLinks = await extractYearPage($);

        for (var i = 0; i < yearShortLinks.length; i++) {
            const yearFullLinks = yearShortLinks[i]["year_link"];
            await subMonthsLink(yearFullLinks);
        }
        // await removeDuplicate();
        process.exit();
    })
    .catch((error) => {
        console.error(error instanceof Error ? error.stack : error);
        process.exit(1);
    });
