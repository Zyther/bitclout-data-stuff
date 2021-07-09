LOAD CSV WITH HEADERS FROM "https://storage.googleapis.com/all_tx/2/usernames.csv" AS value
CREATE (a:Account {
  key: value.Username, 
  publicKey: value.Key,
  username: value.Username, 
  usernameChangeCount: toInteger(value.TimesChanged),
  usernameChangeLastTime: value.LastChanged 
});