const express = require("express");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const PORT = 3000;

var cnnDataLength;

var connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");

  connection.query("SELECT * FROM news.cnn;", (error, elements) => {
    if (error) throw error;
    cnnDataLength = elements.length;
  });
});

app.use(function (req, resp, next) {
  resp.header("Access-Control-Allow-Origin", "*");
  resp.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  resp.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/getCNN/", async function (req, resp) {
  let sql;

  req.query.page = req.query.page * 1000;
  if (req.query.page == 1) {
    sql = `SELECT * FROM news.cnn ORDER BY date LIMIT 0,${req.query.page};`;
  } else if (req.query.page > 1) {
    let offset = req.query.page - 1000;
    sql = `SELECT * FROM news.cnn ORDER BY date LIMIT ${offset},${req.query.page};`;
  } else {
    resp.send(`<pre>Mention page number "/api/getCNN?page={2}"<pre>`);
  }

  const cnnData = await new Promise((resolve, reject) => {
    connection.query(sql, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });

  resp.send(cnnData);
  // await connection.end();
});

const server = app.listen(PORT, () => {
  console.log(`Server running http://localhost:${server.address().port}`);
});
