# Bitclout Data Stuff

https://alec.pro

* raw txo jsonl list ==> SQLite
* SQLite Schema representing most things in a bitclout txo
* N4J Relationships for most txo types (and sub-types like cc buy/sell)
* update from the block

## WARNING

USE THIS REPO WITH CAUTION, WIP
## running anything

* install node 14 (12 will probs work)
* `npm i`
* copy `.env.template` to `.env` fill appropriate vars



### loading sqlite (or mssql) db

* GET JSONLs FIRST!
* `node bulk_load_block.js` first
* `node bulk_load2.js` next

### updating 

* `node do_update.js` will trickle in tx's from block calls.
## TODO

* how to's
* sqlite/mssql => n4j
* mssql graph
* sqlite => elastic

## Appendecies 
### getting JSONLs (up to 2021Jun26)
TODO