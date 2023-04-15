const express = require("express");
const mysql = require("mysql");
require("dotenv").config();
const cors = require('cors')

const app = express();

app.use(cors())

var db_config = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
};

var connection;
function handleDisconnect() {
    connection = mysql.createConnection(db_config);

    connection.connect((err) => {
        if (err) {
            console.log("error when connecting to db:", err);
            setTimeout(handleDisconnect, 2000);
        }
        console.log("Connected!");
    });

    connection.on("error", function (err) {
        console.log("db error", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    console.log(req.query.q);
    req.query.page = req.query.page * 50;
    if (req.query.page == 1) {
        if (req.query.q === undefined) {
            sql = `SELECT * FROM news.cnn ORDER BY date DESC LIMIT 0,${req.query.page};`;
        } else {
            sql = `SELECT * FROM news.cnn WHERE headline LIKE '%${req.query.q}%' ORDER BY date DESC LIMIT 0, ${req.query.page}`;
        }
    } else if (req.query.page > 1) {
        let offset = req.query.page - 50;
        if (req.query.q === undefined) {
            sql = `SELECT * FROM news.cnn ORDER BY date DESC LIMIT ${offset},${req.query.page};`;
        } else {
            sql = `SELECT * FROM news.cnn WHERE headline LIKE '%${req.query.q}%' ORDER BY date DESC LIMIT ${offset}, ${req.query.page}`;
        }
    } else {
        resp.send(`<!DOCTYPE html>
               <html lang="en">

               <head>
                <meta charset="utf-8">
                <title>Error</title>
               </head>

              <body>
                <pre>Cannot GET /api/getCNN</pre>
              </body>

              </html>`);
    }

    const cnnData = await new Promise((resolve, reject) => {
        if (sql === undefined) return;
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

const PORT = 3001;
const server = app.listen(PORT, "localhost", () => {
    console.log(`Server running http://localhost:${server.address().port}`);
});
