//including the required modules
const mysql = require("mysql2");
const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config();

//API credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Configuration for the client
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

//translating the text using google translate API
const translateText = async (text, targetLanguage) => {

  try {
      let [response] = await translate.translate(text, targetLanguage);
      return response;
  } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      return 0;
  }
};

//creating connection with the database
const connection = mysql.createConnection({
  port:"3306",
  host: "localhost",
  user: "root",
  password: "Shrey@2000",
  database: "translate_data"
})

//list of the similar languages
const similarLanguagesList = {
  "hi": ["kn", "bn", "gu", "pa", "ta", "te"],
  "en": ["cy","fr", "de", "it", "es", "nl"],
  "fr": ["de", "it", "es", "nl"]
}


//request hit this after being forwarded from cacheMiddleware, Now the input text will be converted to each of the related languages
//and would be added to the database
const smartCache = (req, res, next) => {
  const { src_lang, target_lang, text } = req.query;
  //hitting the api here for all the similar languages listed above and storing them in the database
  translateText(text,target_lang ).then(response => {
    const similarLanguages = similarLanguagesList[target_lang];
    if(similarLanguages!=null)
    {
      for (let i = 0; i < similarLanguages.length; i++) {
        translateText(text,similarLanguages[i] ).then(resp => {
          connection.query({
            sql: `INSERT INTO translations 
            
            VALUES("${src_lang}", "${similarLanguages[i]}", "${text}", "${resp}" );`,
            timeout: 40000,
          });
        })
  
      }
    }
    
    connection.query({     
      sql: `INSERT INTO translations VALUES("${src_lang}", "${target_lang}", "${text}", "${response}" );`,
      timeout: 40000,
    }, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).send("DB Error occured!");
      }
      next();
    });
  });
}
//exporting this module as required in route.js
module.exports = smartCache;