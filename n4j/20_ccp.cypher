// load creator coins as usernames
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/usernames.csv" AS value
CREATE (c:CCoin {
  key: value.Username, 
  publicKey: value.Key
});
  
// create indicies
CREATE INDEX ccoin_key FOR (c:CCoin) on (c.key)
;
CREATE INDEX ccoin_public_key FOR (c:CCoin) on (c.publicKey)
;

// load buys 
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/cc_buy.csv" AS value
MATCH (a:Account) where a.publicKey = value.TransactorPublicKeyBase58Check
MATCH (b:Account) where b.publicKey = value.CreatorPublicKey
MATCH (c:CCoin) where c.publicKey = value.CreatorPublicKey
CREATE (a)-[x:CCP_LOCK {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),

  key: value.TransactionIDBase58Check + ":LOCK",
  CoinCostNanos: value.CoinCostNanos,
  CoinCostWhole: value.CoinCostWhole
}]->(c)-[y:CCP_FR {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),

  key: value.TransactionIDBase58Check + ":FR",
  FRPercentage: toFloat(value.FRPercentage),
  FounderRewardNanos: toInteger(value.FounderRewardNanos),
  FounderRewardWhole: toFloat(value.FounderRewardWhole)
}]->(b);
