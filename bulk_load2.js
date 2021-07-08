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

  // to individual arrays
  zOutArrays.TransactionHeader.push({
    TransactionIDBase58Check,
    TransactionType,
    TransactionIndexInBlock: TxnIndexInBlock,
    TransactorPublicKeyBase58Check,
    BlockHashHex
  });

  if (Array.isArray(Inputs)) {
    for (var i=0; i < Inputs.length; i++) {
      zOutArrays.TransactionInputs.push({
        RefTransactionIDBase58Check: TransactionIDBase58Check,
        ArrayIndex: i,
        TransactionIDBase58Check: Inputs[i].TransactionIDBase58Check,
        Index: Inputs[i].Index
      });
    }
  }
  if (Array.isArray(Outputs)) {
    for (var i=0; i < Outputs.length; i++) {
      zOutArrays.TransactionOutputs.push({
        RefTransactionIDBase58Check: TransactionIDBase58Check,
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
        RefTransactionIDBase58Check: TransactionIDBase58Check,
        ArrayIndex: i,
        PublicKeyBase58Check: AffectedPublicKeys[i].PublicKeyBase58Check,
        Metadata: AffectedPublicKeys[i].Metadata
      });
    }
  }

  if (BasicTransferTxindexMetadata !== null) {
    let {TotalInputNanos, TotalOutputNanos, FeeNanos} = BasicTransferTxindexMetadata;
    zOutArrays.TransactionMetaBasic.push({
      RefTransactionIDBase58Check: TransactionIDBase58Check,
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
      RefTransactionIDBase58Check: TransactionIDBase58Check,
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
      RefTransactionIDBase58Check: TransactionIDBase58Check,
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
      RefTransactionIDBase58Check: TransactionIDBase58Check,
      CreatorUsername, CreatorCoinToTransferNanos, DiamondLevel, PostHashHex
    });
  }

  if (FollowTxindexMetadata !== null) {
    let {IsUnfollow = null} = FollowTxindexMetadata;
    let isUnfollow = IsUnfollow == false || IsUnfollow == null ? 0 : 1;
    zOutArrays.TransactionMetaFollow.push({
      RefTransactionIDBase58Check: TransactionIDBase58Check,
      IsUnfollow: isUnfollow
    });
  }

  if (LikeTxindexMetadata !== null) {
    let {IsUnlike = null, PostHashHex} = LikeTxindexMetadata;
    let isUnlike = IsUnlike == false || IsUnlike == null ? 0 : 1;
    zOutArrays.TransactionMetaLike.push({
      RefTransactionIDBase58Check: TransactionIDBase58Check,
      PostHashHex,
      isUnlike
    });
  } 

  if (SubmitPostTxindexMetadata !== null) {
    let {
      PostHashBeingModifiedHex, ParentPostHashHex
    } = SubmitPostTxindexMetadata;
    zOutArrays.TransactionMetaPost.push({
      RefTransactionIDBase58Check: TransactionIDBase58Check,
      PostHashBeingModifiedHex, ParentPostHashHex
    });
  }

  if (PrivateMessageTxindexMetadata !== null) {
    zOutArrays.TransactionMetaPrivateMessage.push({
      RefTransactionIDBase58Check: TransactionIDBase58Check,
      TimestampNanos: PrivateMessageTxindexMetadata.TimestampNanos
    });
  }

  if (UpdateProfileTxindexMetadata !== null) {
    let { NewUsername, NewCreatorBasisPoints, NewStakeMultipleBasisPoints, IsHidden } = UpdateProfileTxindexMetadata;
    zOutArrays.TransactionMetaUpdateProfile.push({
      RefTransactionIDBase58Check: TransactionIDBase58Check,
      NewUsername, NewCreatorBasisPoints, NewStakeMultipleBasisPoints, IsHidden
    });

  }

  if (SwapIdentityTxindexMetadata !== null) {
    let {FromPublicKeyBase58Check, ToPublicKeyBase58Check} = SwapIdentityTxindexMetadata;
    zOutArrays.TransactionMetaSwap.push({
      RefTransactionIDBase58Check: TransactionIDBase58Check,
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
    console.log("connecting to sqlite...");
    let {ARCHIVE_IMPORT_PATH, ARCHIVE_COMPLETE_PATH, SQLITE_PATH} = process.env;

    let db = knex({
      client: 'sqlite3', 
      connection: {
        filename: SQLITE_PATH
      }, 
      useNullAsDefault: true
    });
    
    console.log("connected to DB.");

    if (ARCHIVE_COMPLETE_PATH == "" || ARCHIVE_IMPORT_PATH == "" ) {
      throw new Error("need ARCHIVE_IMPORT_PATH and ARCHIVE_COMPLETE_PATH")
    }
    let allFiles = await fs.readdir(ARCHIVE_IMPORT_PATH);
    let allArchiveFiles = await fs.readdir(ARCHIVE_COMPLETE_PATH);

    console.log(allFiles);

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