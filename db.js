//including the mysql module
const mysql = require("mysql2");

//creating connection with mysql database
const connection = mysql.createConnection({
  port:"3306",
  host: "localhost",
  user: "root",
  password: "Shrey@2000",
  database : 'translate_data'
})

connection.connect(function(err) {
  if(err) console.log(err);
});
module.exports = connection;
