// likes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/like/like000000000000.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)-[r:LIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),

  key: value.TransactionIDBase58Check
}]->(p)
;
// likes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/like/like000000000001.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)-[r:LIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]->(p)
;
// likes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/like/like000000000002.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)-[r:LIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]->(p)
;
// likes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/like/like000000000003.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)-[r:LIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]->(p)
;
// likes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/like/like000000000004.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)-[r:LIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]->(p)
;
// likes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/like/like000000000005.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)-[r:LIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]->(p)
;
// likes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/like/like000000000006.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)-[r:LIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]->(p)
;
// likes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/like/like000000000007.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)-[r:LIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]->(p)
;
// likes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/like/like000000000008.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)-[r:LIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]->(p)
;
// likes
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/like/like000000000009.csv" AS value
MATCH (p:Post) WHERE p.key = value.postHex
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
CREATE (a)-[r:LIKE {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]->(p)
;