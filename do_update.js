/**
 * do_update.js
 * STILL A WIP, THOUGH FUNCTIONAL 
 */
 require("dotenv").config();
 require("console-stamp")(console);
 const fs = require("fs").promises;
 const moment = require("moment");
 const knex = require("knex").default;
 const axios = require("axios").default;
 
 const {DELAY_MS = 5000} = process.env
 
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
 };
 
 let gCount = 0;
 
 
 
 async function writeBatch(db) {
   let tableNames = Object.keys(zOutArrays);
   for (var tName of tableNames) {
     let reccs = zOutArrays[tName].splice(0, zOutArrays[tName].length);
     if (tName == "TransactionPrivateMessage") {
       for (var rec of reccs) {
         await db("TransactionMetaPrivateMessage").raw(`
           INSERT INTO TransactionMetaPrivateMessage (TransactionHeaderId, TimestampNanos) VALUES (
             '${rec.TransactionHeaderId}',
             '${rec.TimestampNanos}'
           );
         `);
       }
     } else {
       await db.batchInsert(tName, reccs, 200);
     }
    
   }
 }
 
 async function parseSingle(line, BlockHeight) {
   try {
     let j = line;
       
     let TransactionHeaderId = gCount + 1;
     let {
       TransactionIDBase58Check, 
       TransactionType, 
       Inputs, 
       Outputs, 
       TransactionMetadata = {}
     } = j;
     let {
       TxnIndexInBlock = 0,
       TransactorPublicKeyBase58Check = null,
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
   
     if (BlockHeight == 0) {
       TransactorPublicKeyBase58Check = '8mkU8yaVLs';
     }
   
     // to individual arrays
     zOutArrays.TransactionHeader.push({
       Id: TransactionHeaderId,
       TransactionIDBase58Check,
       TransactionType,
       TransactionIndexInBlock: TxnIndexInBlock,
       TransactorPublicKeyBase58Check,
       BlockHeight
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
         TimestampNanos: `${PrivateMessageTxindexMetadata.TimestampNanos}`.toString()
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
     console.warn(`error with line: ${JSON.stringify(line)}`);
     console.error(ex);
     throw ex;
     }
   }
 
 
 async function iDoUpdate(uri, db) {
   try {
     console.log(`getting latest from db`);
     // let ddb = knex({});
     let latestHeight = await db.distinct("BlockHeight").from("TransactionHeader").orderBy("BlockHeight", "desc").limit(1);
     let latestH = latestHeight[0] !== undefined ? latestHeight[0].BlockHeight : null;
     console.log(latestHeight);
     let nextH = latestH == null ? 0 : parseInt(latestH) + 1;
     
     let latestId = await db.distinct("Id").from("TransactionHeader").orderBy("Id", "desc").limit(1);
     let tLatestID = latestId[0] !== undefined ? latestId[0].Id : 0;
     console.log(`got latest of ${latestH} (latest txid ${tLatestID}), trying for ${nextH}`);
     let nextBlock = await axios.post(`${uri}/api/v1/block`, {
       Height: nextH, 
       FullBlock: true
     }, {
       headers: {
         'Content-Type' : 'application/json'
       }
     });
 
     console.log(Object.keys(nextBlock.data));
     let {Header, Transactions} = nextBlock.data;
 
     console.dir({Header, TranLength: Transactions.length})
     // let ddb = knex();
     let blockExists = await db.select("Height").from("Block").whereRaw(`Height =  ${Header.Height}`);
     if (Array.isArray(blockExists)) {
       console.warn("Block exists already, updating meta");
       await db("Block").update({
         Version: Header.Version,
         BlockHashHex: Header.BlockHashHex,
         BlockStamp: Header.TstampSecs,
         BlockDateTime: moment(Header.TstampSecs * 1000).toISOString()
       }).where("Height", Header.Height);
     } else {
       await db("Block").insert({
         Height: Header.Height,
         Version: Header.Version,
         BlockHashHex: Header.BlockHashHex,
         BlockStamp: Header.TstampSecs,
         BlockDateTime: moment(Header.TstampSecs * 1000).toISOString()
       });
     }
     
     gCount = tLatestID;
     for (var tx of Transactions) {
       gCount++;
       await parseSingle(tx, nextH);
     }
 
     console.log(`writing ${zOutArrays.TransactionHeader.length} transactions for block ${Header.Height}`);
     await writeBatch(db);
     console.log("done with block " + Header.Height)
 
     return true;
 
   } catch (ex) {
     console.dir(ex);
     throw ex;
   }
 }
 
 function doUpdate(uri, db) {
   return new Promise((ok,ko) => {
     console.log(`waiting ${DELAY_MS} ms`);
     setTimeout(async () => {
       iDoUpdate(uri, db).then(v => ok(v)).catch(ex => ko(ex));
     }, DELAY_MS);
   });
 }
 
 (async () => {
   let db = null;
   try {
 
     const {DB_TYPE, BITCLOUT_API_URL} = process.env;
     if (BITCLOUT_API_URL == '') {
       throw new Error("BITCLOUT_API_URL must exist");
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
     db = knex(dbOptions);
     console.log("connected to DB.");
 
 
     let retries = 0;
 
     let keepGoing = true;
     while (keepGoing == true) {
       try {
         keepGoing = await doUpdate(BITCLOUT_API_URL, db);
         retries = 0;
       } catch(ex) {
         let {response = {}} = ex;
         let {status = null, data = null} = response;
         if (status == 429) {
           if (retries < 10) {
           console.warn("429. Trying again");
           retries++;
           } else {
             throw new Error("too many 429s");
           }
         } else if (data !== null) {
           let {Error} = data;
           if (`${Error}`.startsWith("APIBlockRequest: Height requested")) {
             console.log("we're up to date!");
             keepGoing = false;
           } else {
             throw ex;
           }
         } else {
           throw ex;
         }
       }
     } 
     
   } catch (ex) {
     tError = ex;
   } finally {
     console.log("destroying db instance");
     await db.destroy();
 
     if (tError) {
       console.error(tError);
       console.warn("there was an error. see above.");
     } else {
       console.log("update success");
     }
   }
 })();