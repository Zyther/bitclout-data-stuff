// unlikes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/unlike.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)<-[r:UNLIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]-(p)
;