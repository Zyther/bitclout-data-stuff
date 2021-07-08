require("dotenv").config();
require("console-stamp")(console);
const fs = require("fs").promises;
const moment = require("moment");
const knex = require("knex").default;
(async () => {
  try {
    console.log("connecting to DB...");
    let {BLOCK_JSONL_FILE, SQLITE_PATH} = process.env;
    let db = knex({
      client: 'sqlite3', 
      connection: {
        filename: SQLITE_PATH
      }, 
      useNullAsDefault: true
    });
    
    console.log("connected to DB.");
    // await db.raw(`SET TRANSACTION ISOLATION LEVEL OFF`);
    // db.raw(`SET TRANSACTION ISOLATION LEVEL read committed snapshot`)

    if ( BLOCK_JSONL_FILE == '' ) {
      throw new Error("need BLOCK_JSONL_FILE")
    }
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
    await db.batchInsert("Block", recArray, 500);
   
    console.log("destroying db instance");
    await db.destroy();
    console.log("done!")
  } catch (ex) {
    console.error(ex);
  }
})();