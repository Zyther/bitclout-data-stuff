LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/reward.csv" AS value
MATCH (a:Account) WHERE a.publicKey = value.Transactor
MATCH (r:Account) WHERE r.publicKey = value.RewardRecipientPublicKeyBase58Check
CREATE (a)-[b:BLOCK_REWARD {
    key: value.TransactionIDBase58Check + ":" + value.RewardRecipientPublicKeyBase58Check,
    amount: toInteger(value.RewardAmount),
    amountWhole: toFloat(value.RewardAmountWhole),
    Height: toInteger(value.Height),
    Index: toInteger(value.Index),
    blockStamp: toInteger(value.TstampSecs),
    blockDateTime: datetime({epochSeconds: toInteger(value.TstampSecs)}),

    to: r.key
}]->(r)
;