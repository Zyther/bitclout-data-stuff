// load sells
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/cc_sell.csv" AS value
MATCH (a:Account) where a.publicKey = value.TransactorPublicKeyBase58Check
MATCH (c:CCoin) where c.publicKey = value.CreatorPublicKey
CREATE (a)-[x:CCS_BURN {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check + ":BURN",
  CreatorCoinAmountNanos: toInteger(value.CreatorCoinAmountNanos),
  CreatorCoinAmountWhole: toFloat(value.CreatorCoinAmountWhole)
}]->(c)-[y:CCS_PAYOUT {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check + ":PAYOUT",
  BitCloutNanosSoldFor: toInteger(value.BitCloutNanosSoldFor),
  BitCloutWholeSoldFor: toFloat(value.BitCloutWholeSoldFor)
}]->(a);
