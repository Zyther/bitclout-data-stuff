# Bitclout Data Stuff

* Block ==> SQLite
* SQLite Schema representing most things in a bitclout txo
* N4J Relationships for most txo types (and sub-types like cc buy/sell)
* update from the block (easy, follows same logic in `bulk_load2.js`)


## running anything

* `npm i`
* copy `.env.template` to `.env` fill appropriate vars

### WARNING

USE THIS REPO WITH CAUTION, WIP

### loading sqlite db

* GET JSONLs FIRST!
* `node bulk_load_block.js` first
* `node bulk_load2.js` next

## TODO

* how to's
* sqlite => n4j
* mssql graph
* sqlite => elastic

## Appendecies 
### getting JSONLs (up to 2021Jun26)
TODO