CREATE TABLE [Block] (
  [Height] int PRIMARY KEY,
  [Version] int,
  [BlockHashHex] varchar(64) UNIQUE NOT NULL,
  [BlockStamp] int NOT NULL,
  [BlockDateTime] datetime NOT NULL
)
;

CREATE TABLE [TransactionHeader] (
  [TransactionIDBase58Check] varchar(64) PRIMARY KEY,
  [TransactionType] varchar(64) NOT NULL,
  [TransactionIndexInBlock] int NOT NULL,
  [TransactorPublicKeyBase58Check] varchar(64) NOT NULL,
  [BlockHashHex] varchar(64) NOT NULL,
  FOREIGN KEY(BlockHashHex) REFERENCES Block(BlockHashHex)
)
;

CREATE TABLE [TransactionInputs] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [ArrayIndex] int NOT NULL,
  [TransactionIDBase58Check] varchar(64) NOT NULL,
  [Index] int,
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;

CREATE TABLE [TransactionOutputs] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [ArrayIndex] int NOT NULL,
  [PublicKeyBase58Check] varchar(64) NOT NULL,
  [AmountNanos] bigint NOT NULL,
  [Index] int,
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)

)
;

CREATE TABLE [TransactionAffectedKeys] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [ArrayIndex] int NOT NULL,
  [PublicKeyBase58Check] varchar(64) NOT NULL,
  [Metadata] varchar(64),
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)

)
;

CREATE TABLE [TransactionMetaBasic] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [TotalInputNanos] bigint NOT NULL,
  [TotalOutputNanos] bigint NOT NULL,
  [FeeNanos] bigint NOT NULL,
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;

CREATE TABLE [TransactionMetaCreator] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [OperationType] varchar(4) NOT NULL,
  [BitCloutToSellNanos] bigint,
  [CreatorCoinToSellNanos] bigint,
  [BitCloutToAddNanos] bigint,
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;

CREATE TABLE [TransactionMetaCreatorTransfer] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [CreatorUsername] varchar(255),
  [CreatorCoinToTransferNanos] bigint NOT NULL,
  [DiamondLevel] int NOT NULL,
  [PostHashHex] varchar(64),
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;

CREATE TABLE [TransactionMetaFollow] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [IsUnfollow] BIT,
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;

CREATE TABLE [TransactionMetaPost] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [PostHashBeingModifiedHex] varchar(64),
  [ParentPostHashHex] varchar(64),
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;

CREATE TABLE [TransactionMetaLike] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [PostHashHex] varchar(64) NOT NULL,
  [IsUnlike] BIT,
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;

CREATE TABLE [TransactionMetaUpdateProfile] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [NewUsername] varchar(255),
  [NewCreatorBasisPoints] int,
  [NewStakeMultipleBasisPoints] int,
  [IsHidden] BIT,
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;

CREATE TABLE [TransactionMetaPrivateMessage] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [TimestampNanos] bigint NOT NULL,
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;

CREATE TABLE [TransactionMetaBitcoinExchange] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [BitcoinSpendAddress] varchar(255),
  [SatoshisBurned] bigint,
  [NanosCreated] bigint,
  [TotalNanosPurchasedBefore] bigint,
  [TotalNanosPurchasedAfter] bigint,
  [BitcoinTxnHash] varchar(255),
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;


CREATE TABLE [TransactionMetaSwap] (
  [RefTransactionIDBase58Check] varchar(64) NOT NULL,
  [FromPublicKeyBase58Check] varchar(64) NOT NULL,
  [ToPublicKeyBase58Check] varchar(64) NOT NULL,
  FOREIGN KEY(RefTransactionIDBase58Check) REFERENCES TransactionHeader(TransactionIDBase58Check)
)
;
