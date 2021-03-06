LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/basic.csv" AS value
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
MATCH (r:Account) WHERE r.publicKey = COALESCE(value.ReceiverPublicKey, value.TransactorPublicKeyBase58Check)
CREATE (a)-[b:BASIC_TRANSFER {
    key: COALESCE(value.TransactionIDBase58Check, value.Height + '-' + value.Index),
    amount: COALESCE(toInteger(value.AmountNanos),0),
    amountWhole: COALESCE(toFloat(value.AmountWhole), 0.0),
    Height: toInteger(value.Height),
    Index: toInteger(value.Index),
    blockStamp: toInteger(value.TstampSecs),
    blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
    from: a.key,
    to: r.key
}]->(r);
