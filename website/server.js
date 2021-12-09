const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");

var cnnData;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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

app.get("/", function (req, resp) {
  const viewData = { cnnData: cnnData };
  resp.render("dataTemplate", viewData);
});

app.listen(3000);
