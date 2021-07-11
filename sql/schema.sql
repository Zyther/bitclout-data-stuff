CREATE TABLE [Block] (
  [Height] int PRIMARY KEY,
  [Version] int,
  [BlockHashHex] varchar(64) UNIQUE NOT NULL,
  [BlockStamp] int NOT NULL,
  [BlockDateTime] datetime NOT NULL
)
;

CREATE TABLE [TransactionHeader] (
  [Id] bigint PRIMARY KEY,
  [TransactionIDBase58Check] varchar(64) NOT NULL UNIQUE,
  [TransactionType] varchar(64) NOT NULL,
  [TransactionIndexInBlock] int NOT NULL,
  [TransactorPublicKeyBase58Check] varchar(64) NOT NULL,
  [BlockHeight] varchar(64) NOT NULL REFERENCES Block(BlockHashHex)
)
;

CREATE TABLE [TransactionInputs] (
  [TransactionHeaderId] bigint NOT NULL,
  [ArrayIndex] int NOT NULL,
  [TransactionIDBase58Check] varchar(64) NOT NULL,
  [Index] int,
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE

)
;

CREATE TABLE [TransactionOutputs] (
  [TransactionHeaderId] bigint NOT NULL,
  [ArrayIndex] int NOT NULL,
  [PublicKeyBase58Check] varchar(64) NOT NULL,
  [AmountNanos] bigint NOT NULL,
  [Index] int,
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE

)
;

CREATE TABLE [TransactionAffectedKeys] (
  [TransactionHeaderId] bigint NOT NULL,
  [ArrayIndex] int NOT NULL,
  [PublicKeyBase58Check] varchar(64) NOT NULL,
  [Metadata] varchar(64),
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE

)
;

CREATE TABLE [TransactionMetaBasic] (
  [TransactionHeaderId] bigint NOT NULL,
  [TotalInputNanos] bigint NOT NULL,
  [TotalOutputNanos] bigint NOT NULL,
  [FeeNanos] bigint NOT NULL,
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE
)
;

CREATE TABLE [TransactionMetaCreator] (
  [TransactionHeaderId] bigint NOT NULL,
  [OperationType] varchar(4) NOT NULL,
  [BitCloutToSellNanos] bigint,
  [CreatorCoinToSellNanos] bigint,
  [BitCloutToAddNanos] bigint,
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE
)
;

CREATE TABLE [TransactionMetaCreatorTransfer] (
  [TransactionHeaderId] bigint NOT NULL,
  [CreatorUsername] varchar(255),
  [CreatorCoinToTransferNanos] bigint NOT NULL,
  [DiamondLevel] int NOT NULL,
  [PostHashHex] varchar(64),
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE
)
;

CREATE TABLE [TransactionMetaFollow] (
  [TransactionHeaderId] bigint NOT NULL,
  [IsUnfollow] BIT,
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE
)
;

CREATE TABLE [TransactionMetaPost] (
  [TransactionHeaderId] bigint NOT NULL,
  [PostHashBeingModifiedHex] varchar(64),
  [ParentPostHashHex] varchar(64),
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE
)
;

CREATE TABLE [TransactionMetaLike] (
  [TransactionHeaderId] bigint NOT NULL,
  [PostHashHex] varchar(64) NOT NULL,
  [IsUnlike] BIT,
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE
)
;

CREATE TABLE [TransactionMetaUpdateProfile] (
  [TransactionHeaderId] bigint NOT NULL,
  [NewUsername] varchar(255),
  [NewCreatorBasisPoints] int,
  [NewStakeMultipleBasisPoints] int,
  [IsHidden] BIT,
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE
)
;

CREATE TABLE [TransactionMetaPrivateMessage] (
  [TransactionHeaderId] bigint NOT NULL,
  [TimestampNanos] bigint NOT NULL,
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE
)
;

CREATE TABLE [TransactionMetaBitcoinExchange] (
  [TransactionHeaderId] bigint NOT NULL,
  [BitcoinSpendAddress] varchar(255),
  [SatoshisBurned] bigint,
  [NanosCreated] bigint,
  [TotalNanosPurchasedBefore] bigint,
  [TotalNanosPurchasedAfter] bigint,
  [BitcoinTxnHash] varchar(255),
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE
)
;


CREATE TABLE [TransactionMetaSwap] (
  [TransactionHeaderId] bigint NOT NULL,
  [FromPublicKeyBase58Check] varchar(64) NOT NULL,
  [ToPublicKeyBase58Check] varchar(64) NOT NULL,
  FOREIGN KEY(TransactionHeaderId) REFERENCES TransactionHeader(Id) ON DELETE CASCADE
)
;
