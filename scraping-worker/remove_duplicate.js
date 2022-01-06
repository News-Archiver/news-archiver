const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "news",
});

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

removeDuplicate();
