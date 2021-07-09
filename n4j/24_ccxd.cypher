LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/ccx_diamond.csv" AS value
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
MATCH (r:Account) WHERE r.publicKey = value.ReceiverPublicKey
MATCH (p:Post) WHERE p.key = value.PostHashHex
CREATE (a)-[q:DIAMONDS {
    key: COALESCE(value.TransactionIDBase58Check, value.Height + '-' + value.Index),
    creatorCoinAmount: toInteger(value.CreatorCoinAmountNanos),
    creatorCoinAmountWhole: toInteger(value.CreatorCoinAmountWhole),
    creatorCoinUsername: value.CreatorUsername,
    isDiamonds: value.isDiamonds,
    diamondLevel: toInteger(value.DiamondLevel),
    Height: toInteger(value.Height),
    Index: toInteger(value.Index),
    blockStamp: toInteger(value.TstampSecs),
    blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)})
}]->(p)
// CREATE (a)-[b:CREATOR_COIN_TRANSFER {
//     key: COALESCE(value.TransactionIDBase58Check, value.Height + '-' + value.Index),
//     creatorCoinAmount: value.CreatorCoinAmountNanos,
//     creatorCoinAmountWhole: value.CreatorCoinAmountWhole,
//     creatorCoinUsername: value.CreatorUsername,
//     isDiamonds: value.isDiamonds,
//     diamondLevel: value.DiamondLevel,
//     Height: value.Height,
//     blockIndex: value.Index,
//     blockStamp: value.TstampSecs,
//     from: a.key,
//     to: r.key
// }]->(r);