const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = 3000;

var cnnData = new Array();

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "news",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");

  let getData = "SELECT * FROM news.cnn;";

  connection.query(getData, (err, result) => {
    if (err) throw err;
    cnnData = result;
  });
  connection.end();
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

app.get("/api/getCNN", function (req, resp) {
  resp.send(cnnData);
});

const server = app.listen(PORT, () => {
  console.log(`Server running http://localhost:${server.address().port}`);
});
