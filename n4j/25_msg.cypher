// PM
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/pm.csv" AS value
MATCH (a: Account) where a.publicKey = value.TransactorPublicKeyBase58Check
MATCH (r: Account) where r.publicKey = value.Recipient


CREATE (a)-[b:PRIVATE_MESSAGE {
  key: value.TransactionIDBase58Check,
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  PrivateMessageTimestamp: toInteger(value.PrivateMessageTimestamp),
  PrivateMessageDateTime: datetime({epochMillis:toInteger(value.PrivateMessageTimestamp)}),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  from: a.key,
  to: r.key
}]->(r)
;


