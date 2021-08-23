//including the required modules
const route = require("express").Router();
const mysql = require("mysql");
const smartCache = require("../middlewares/smartCache");
const cacheMiddleware = require("../middlewares/cacheMiddleware");

//creating connection with the database
const connection = mysql.createConnection({
  port: "3306",
  host: "localhost",
  user: "root",
  password: "Shrey@2000",
  database: "translate_data"
})
route.get("/translate", cacheMiddleware, smartCache, async (req, res) => {

  //this is the final stage, now the required data is already present in the database, we just need to fetch that data from the database
  //for the requested query
  const { src_lang, target_lang, text } = req.query;
  connection.query({
    sql: `SELECT * FROM translations 
    where src_lang="${src_lang}" 
    and target_lang="${target_lang}" 
    and text="${text}";`,
    timeout: 40000,
  }, (err, results) => {
    if (err) {
      return res.status(500).send("DB Error occured!");
    }
    if (results.length !== 0) {
      return res.status(200).send({ ...results[0] })
    }
    return res.status(500).send("Server Error occured!");
  });
})
//exporting this module because required in index.js
module.exports = route;