// load all posts first
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/submit_post.csv" AS value
CREATE (p: Post {
  key: value.postHex,
  parentKey: value.parentPostHex,
  ownerKey: value.TransactorPublicKeyBase58Check
})
;

// create indicies
CREATE INDEX post_key FOR (p:Post) on (p.key)
;

CREATE INDEX parent_post_key FOR (p:Post) on (p.parentKey)
;

CREATE INDEX post_owner_key FOR (p:Post) on (p.ownerKey)
;

// associate username to post
MATCH (p:Post)
MATCH (z:Account) WHERE z.publicKey = p.ownerKey
SET p.ownerUsername = COALESCE(z.username, null)
;


// load SUBMIT_POST relationship
LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/submit_post.csv" AS value
MATCH (a:Account) WHERE a.publicKey = value.TransactorPublicKeyBase58Check
MATCH (p:Post) WHERE p.key = value.postHex
CREATE (a)-[b:SUBMIT_POST {
  Height: toInteger(value.Height),
  Index: toInteger(value.Index),
  blockStamp: toInteger(value.TstampSecs),
  blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),
  key: value.TransactionIDBase58Check
}]->(p)
;


// load comment_of
MATCH(p:Post)
MATCH(q:Post) where q.key = p.parentKey
CREATE (p)-[r:comment_of]->(q);