LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/ccx_nodiamond.csv" AS value
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
MATCH (r:Account) WHERE r.publicKey = value.ReceiverPublicKey
CREATE (a)-[b:CREATOR_COIN_TRANSFER {
    key: COALESCE(value.TransactionIDBase58Check, value.Height + '-' + value.Index),
    creatorCoinAmount: toInteger(value.CreatorCoinAmountNanos),
    creatorCoinAmountWhole: toFloat(value.CreatorCoinAmountWhole),
    creatorCoinUsername: value.CreatorUsername,
    isDiamonds: value.isDiamonds,
    diamondLevel: COALESCE(toInteger(value.DiamondLevel), 0),
    Height: toInteger(value.Height),
    Index: toInteger(value.Index),
    blockStamp: toInteger(value.TstampSecs),
    blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),

    from: a.key,
    to: r.key
}]->(r);