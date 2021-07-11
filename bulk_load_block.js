require("dotenv").config();
require("console-stamp")(console);
const fs = require("fs").promises;
const moment = require("moment");
const knex = require("knex").default;
(async () => {
  try {

    const {DB_TYPE, BLOCK_JSONL_FILE} = process.env;

    if ( BLOCK_JSONL_FILE == '' ) {
      throw new Error("need BLOCK_JSONL_FILE")
    }
    if (DB_TYPE !== 'mssql' && DB_TYPE !== 'sqlite') {
      throw new Error("DB_TYPE must be mssql or sqlite. plz set accordingly.");
    }
    let dbOptions = {};
    if (DB_TYPE == 'mssql') {
      const {MSSQL_HOST, MSSQL_DB, MSSQL_USER, MSSQL_PASS, MSSQL_PORT = 1433 } = process.env;
      dbOptions = {
        client: 'mssql', 
        connection: {
          host: MSSQL_HOST,
          user: MSSQL_USER,
          password: MSSQL_PASS,
          options: {
            encrypt: true,
            database: MSSQL_DB,
            port: MSSQL_PORT
          }
        }, 
      };
    } else {
      const {SQLITE_PATH} = process.env;
      dbOptions = {
        client: 'sqlite3', 
        connection: {
          filename: SQLITE_PATH
        }, 
        useNullAsDefault: true
      };
    }

    if (typeof dbOptions.client !== 'string') {
      throw new Error("something's gone wrong, db options weren't set right.");
    }

    console.log(`connecting to ${DB_TYPE}...`);
    let db = knex(dbOptions);
    console.log("connected to DB.");

    
    let bFile = await fs.readFile(BLOCK_JSONL_FILE);
    let sFile = bFile.toString('utf-8').split("\n");
    // let jFile = JSON.parse(sFile)
    let recArray = [];
    for (var i in sFile) {
      if (sFile[i].length > 0) {
        let sRec = sFile[i];
        let rec = JSON.parse(sRec);
        recArray.push({
          Height: parseInt(rec.Height),
          Version: parseInt(rec.Version),
          BlockHashHex: rec.BlockHashHex,
          BlockStamp: rec.TstampSecs,
          BlockDateTime: moment(parseInt(rec.TstampSecs) * 1000).toISOString()
        });
      }
    }
    await db.batchInsert("Block", recArray, 200);
   
    console.log("destroying db instance");
    await db.destroy();
    console.log("done!")
  } catch (ex) {
    console.error(ex);
  }
})();