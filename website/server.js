const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = 3000;

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "news",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");

  // let sql = "SELECT * FROM news.cnn;";
  // 1 = 0, 1000
  // 2 = 1000, 2000
  // 3 = 2000, 3000
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

app.get("/api/getCNN/", function (req, resp) {
  let sql, cnnData;

  if (req.query.page == 1) {
    sql = "SELECT * FROM news.cnn ORDER BY date LIMIT 0,1000";
  } else {
    sql = "SELECT * FROM news.cnn;";
  }

  console.log(sql);

  connection.query(sql, async (err, result) => {
    if (err) throw err;
    cnnData = await result;
  });
  console.log(cnnData); // undefined, why?
  resp.send(cnnData);
  connection.end();
});

const server = app.listen(PORT, () => {
  console.log(`Server running http://localhost:${server.address().port}`);
});
