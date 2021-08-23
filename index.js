//including required modules
const express = require("express");
const mysql = require("mysql");
require("./db");
const app = express();
const PORT = process.env.PORT || 1010;

//using route 
app.use(require("./routes/route"));

//starting the server
app.listen(PORT, () =>
{
    console.log(`Server is up at Port number ${PORT}`)
});