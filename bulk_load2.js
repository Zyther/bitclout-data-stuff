require("dotenv").config();
require("console-stamp")(console);
const fs = require("fs").promises;
const fsr = require("fs");
const knex = require("knex").default;
const es = require("event-stream");

let zCount = 0;
let zOutArrays = {
  TransactionHeader: [],
  TransactionInputs: [],
  TransactionOutputs: [],
  TransactionAffectedKeys: [],
  TransactionMetaBasic: [],
  TransactionMetaBitcoinExchange: [],
  TransactionMetaCreator: [],
  TransactionMetaCreatorTransfer: [],
  TransactionMetaFollow: [],
  TransactionMetaLike: [],
  TransactionMetaPost: [],
  TransactionMetaPrivateMessage: [],
  TransactionMetaUpdateProfile: [],
  TransactionMetaSwap: []
}
let zBlocks = {};
async function writeBatch(db) {
  let tableNames = Object.keys(zOutArrays);
  for (var tName of tableNames) {
    let reccs = zOutArrays[tName].splice(0, zOutArrays[tName].length);
    await db.batchInsert(tName, reccs, 500);
  }
}

async function parseSingle(line) {
 try {
  let j = JSON.parse(line);
  zCount++;

  let TransactionHeaderId = zCount;
  
  let {
    TransactionIDBase58Check, 
    TransactionType, 
    BlockHashHex, 
    Inputs, 
    Outputs, 
    TransactionMetadata
  } = j;
  let {
    TxnIndexInBlock,
    TransactorPublicKeyBase58Check,
    AffectedPublicKeys = null,
    BasicTransferTxindexMetadata = null,
    BitcoinExchangeTxindexMetadata = null,
    CreatorCoinTxindexMetadata = null,
    CreatorCoinTransferTxindexMetadata = null,
    FollowTxindexMetadata = null,
    LikeTxindexMetadata = null,
    PrivateMessageTxindexMetadata = null,
    SubmitPostTxindexMetadata = null,
    SwapIdentityTxindexMetadata = null,
    UpdateProfileTxindexMetadata = null
  } = TransactionMetadata;

  let BlockHeight = zBlocks[BlockHashHex];

  // to individual arrays
  zOutArrays.TransactionHeader.push({
    Id: TransactionHeaderId,
    TransactionIDBase58Check,
    TransactionType,
    TransactionIndexInBlock: TxnIndexInBlock,
    TransactorPublicKeyBase58Check,
    BlockHashHex
  });

  if (Array.isArray(Inputs)) {
    for (var i=0; i < Inputs.length; i++) {
      zOutArrays.TransactionInputs.push({
        TransactionHeaderId,
        ArrayIndex: i,
        TransactionIDBase58Check: Inputs[i].TransactionIDBase58Check,
        Index: Inputs[i].Index
      });
    }
  }
  if (Array.isArray(Outputs)) {
    for (var i=0; i < Outputs.length; i++) {
      zOutArrays.TransactionOutputs.push({
        TransactionHeaderId,
        ArrayIndex: i,
        PublicKeyBase58Check: Outputs[i].PublicKeyBase58Check,
        Index: Outputs[i].Index,
        AmountNanos: Outputs[i].AmountNanos
      });
    }
  }

  if (Array.isArray(AffectedPublicKeys)) {
    for (var i=0; i < AffectedPublicKeys.length; i++) {
      zOutArrays.TransactionAffectedKeys.push({
        TransactionHeaderId,
        ArrayIndex: i,
        PublicKeyBase58Check: AffectedPublicKeys[i].PublicKeyBase58Check,
        Metadata: AffectedPublicKeys[i].Metadata
      });
    }
  }

  if (BasicTransferTxindexMetadata !== null) {
    let {TotalInputNanos, TotalOutputNanos, FeeNanos} = BasicTransferTxindexMetadata;
    zOutArrays.TransactionMetaBasic.push({
      TransactionHeaderId,
      TotalInputNanos, TotalOutputNanos, FeeNanos
    });
  }

  if (BitcoinExchangeTxindexMetadata !== null) {
    let { 
      BitcoinSpendAddress, 
      SatoshisBurned, 
      NanosCreated, 
      TotalNanosPurchasedBefore, 
      TotalNanosPurchasedAfter, 
      BitcoinTxnHash
    } = BitcoinExchangeTxindexMetadata;
    
    zOutArrays.TransactionMetaBitcoinExchange.push({
      TransactionHeaderId,
      BitcoinSpendAddress, SatoshisBurned, NanosCreated, TotalNanosPurchasedBefore, TotalNanosPurchasedAfter, BitcoinTxnHash
    }); 
  }

  if (CreatorCoinTxindexMetadata !== null) {
    let {
      OperationType,
      BitCloutToSellNanos,
      CreatorCoinToSellNanos,
      BitCloutToAddNanos
    } = CreatorCoinTxindexMetadata;
    zOutArrays.TransactionMetaCreator.push({
      TransactionHeaderId,
      OperationType, BitCloutToSellNanos, CreatorCoinToSellNanos, BitCloutToAddNanos
    });
  }

  if (CreatorCoinTransferTxindexMetadata !== null) {
    let {
      CreatorUsername,
      CreatorCoinToTransferNanos,
      DiamondLevel,
      PostHashHex
    } = CreatorCoinTransferTxindexMetadata;
    zOutArrays.TransactionMetaCreatorTransfer.push({
      TransactionHeaderId,
      CreatorUsername, CreatorCoinToTransferNanos, DiamondLevel, PostHashHex
    });
  }

  if (FollowTxindexMetadata !== null) {
    let {IsUnfollow = null} = FollowTxindexMetadata;
    let isUnfollow = IsUnfollow == false || IsUnfollow == null ? 0 : 1;
    zOutArrays.TransactionMetaFollow.push({
      TransactionHeaderId,
      IsUnfollow: isUnfollow
    });
  }

  if (LikeTxindexMetadata !== null) {
    let {IsUnlike = null, PostHashHex} = LikeTxindexMetadata;
    let isUnlike = IsUnlike == false || IsUnlike == null ? 0 : 1;
    zOutArrays.TransactionMetaLike.push({
      TransactionHeaderId,
      PostHashHex,
      isUnlike
    });
  } 

  if (SubmitPostTxindexMetadata !== null) {
    let {
      PostHashBeingModifiedHex, ParentPostHashHex
    } = SubmitPostTxindexMetadata;
    zOutArrays.TransactionMetaPost.push({
      TransactionHeaderId,
      PostHashBeingModifiedHex, ParentPostHashHex
    });
  }

  if (PrivateMessageTxindexMetadata !== null) {
    zOutArrays.TransactionMetaPrivateMessage.push({
      TransactionHeaderId,
      TimestampNanos: PrivateMessageTxindexMetadata.TimestampNanos
    });
  }

  if (UpdateProfileTxindexMetadata !== null) {
    let { NewUsername, NewCreatorBasisPoints, NewStakeMultipleBasisPoints, IsHidden } = UpdateProfileTxindexMetadata;
    zOutArrays.TransactionMetaUpdateProfile.push({
      TransactionHeaderId,
      NewUsername, NewCreatorBasisPoints, NewStakeMultipleBasisPoints, IsHidden
    });

  }

  if (SwapIdentityTxindexMetadata !== null) {
    let {FromPublicKeyBase58Check, ToPublicKeyBase58Check} = SwapIdentityTxindexMetadata;
    zOutArrays.TransactionMetaSwap.push({
      TransactionHeaderId,
      FromPublicKeyBase58Check, ToPublicKeyBase58Check
    });
  }
 } catch (ex) {
  console.warn(`error with line: ${line}`);
  console.error(ex);
  db.destroy();
   throw ex;
 }
}
async function handleBatch(batch, db) {
  try {
    for (var line of batch) {
      if (`${line}`.trim().length !== 0) {
        await parseSingle(line);
      }
    }
    await writeBatch(db);
  } catch (ex) {
    db.destroy();
    console.error(ex);
    throw ex;
  }
}
function handleHugeJSONL(file, db) {
  zCount = 0;
  let zQueue = [];
  // let sqlRunning = false;
  let zInterval = setInterval(() => {
    console.log(`${zCount} records processed.`);
  }, 5000);
  return new Promise((ok,ko) => {
    
    
    var s = fsr.createReadStream(file)
        .pipe(es.split())
        .pipe(es.mapSync(function(line){
            // pause the readstream
            s.pause();
            zQueue.push(line);
            if (zQueue.length >= 1000) {
              let zSplice = zQueue.splice(0, 1000);

              handleBatch(zSplice, db).then(() =>{
                s.resume();
              }).catch(ex => {
                console.error(ex);
                console.warn("Failed on " + zCount);
                clearInterval(zInterval);
                s.destroy();
                return ko(ex);
              })
            } else {
              s.resume();
            }
            
        })
        .on('error', function(err){
            console.log('Error while reading file.', err);
            clearInterval(zInterval);
            return ko(err);
        })
        .on('end', function(){
            console.log('Read entire file.');
            clearInterval(zInterval);
            if (zQueue.length > 0) {
              console.log('Running final batch');
              let zSplice = zQueue.splice(0, zQueue.length);
              handleBatch(zSplice, db).then(() => {
                return ok(true);
              }).catch(ex => {
                console.error(ex);
                return ko(ex);
              });
            }  else {
              return ok(true);
            }
        })
    );
  });
}


(async () => {
  try {
    const {DB_TYPE} = process.env;

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


    const {ARCHIVE_IMPORT_PATH, ARCHIVE_COMPLETE_PATH} = process.env;

    if (ARCHIVE_COMPLETE_PATH == "" || ARCHIVE_IMPORT_PATH == "" ) {
      throw new Error("need ARCHIVE_IMPORT_PATH and ARCHIVE_COMPLETE_PATH")
    }
    let allFiles = await fs.readdir(ARCHIVE_IMPORT_PATH);
    let allArchiveFiles = await fs.readdir(ARCHIVE_COMPLETE_PATH);

    console.log(allFiles);

    console.log("getting all blox from db");

    let allBlockHashHexes = await db.select(['Height', 'BlockHashHex']).from('Block');
    
    for (var blok of allBlockHashHexes) {
      zBlocks[blok.BlockHashHex] = blok.Height;
    }
    
    for (var file of allFiles) {
      let isFound = false;
      for (var f of allArchiveFiles) {
        if (f == file) {
          isFound = true;
        }
      }
      if (!!!isFound) {
        console.log(`processing file ${file}`);
        await handleHugeJSONL(`${ARCHIVE_IMPORT_PATH}\\${file}`, db);
        console.log(`copying ${file} to ${ARCHIVE_COMPLETE_PATH}`);
        fs.copyFile(`${ARCHIVE_IMPORT_PATH}\\${file}`, `${ARCHIVE_COMPLETE_PATH}\\${file}`);
      } else {
        console.log(`skipping file ${file}`);
      }
    
    }
   
    console.log("destroying db instance");
    await db.destroy();
    console.log("done!")
  } catch (ex) {
    console.error(ex);
  }
})();