CREATE INDEX account_key_index FOR (a:Account) on (a.key)
;
CREATE INDEX account_publicKey_index FOR (a:Account) on (a.publicKey)
;

CREATE INDEX account_username_index FOR (a:Account) on (a.username)
;

CREATE  (a:Account {
  key: "8mkU8yaVLs",
  publicKey: "8mkU8yaVLs"
})
;

LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/pubKeys.csv" AS value
OPTIONAL MATCH (z:Account) WHERE z.publicKey = value.TransactorPublicKeyBase58Check
WITH COALESCE(z.key, value.TransactorPublicKeyBase58Check) as tk, value
MERGE (a:Account {key: tk, publicKey: value.TransactorPublicKeyBase58Check})
;
