import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedClosePositionWithTokenExtensionsInstruction, DecodedOpenPositionWithTokenExtensionsInstruction, DecodedSwapV2Instruction, DecodedTwoHopSwapV2Instruction, TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("TokenExtensions based Position NFT", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/tokenExtensionsBasedPositionNft/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("openPositionWithTokenExtensions", async () => {
    const blockJSONFile = "openPositionWithTokenExtensions.json"
    const signature = "5YZyP7TAMfLSsk9LNnc2QScsdAuu2xgNVeXw4iiaJgUH89eMQfwPKMw917XLmYy1aDEe4YXtzQJK31itzFwyGkQi";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("openPositionWithTokenExtensions");

    const ixs0 = ixs[0] as DecodedOpenPositionWithTokenExtensionsInstruction;

    expect(ixs0.data.tickLowerIndex).toEqual(0);
    expect(ixs0.data.tickUpperIndex).toEqual(11392);
    expect(ixs0.data.withTokenMetadataExtension).toEqual(true);
    expect(ixs0.accounts.funder).toEqual("r21Gamwd9DtyjHeGywsneoQYR39C1VDwrw7tWxHAwh6");
    expect(ixs0.accounts.owner).toEqual("r21Gamwd9DtyjHeGywsneoQYR39C1VDwrw7tWxHAwh6");
    expect(ixs0.accounts.position).toEqual("2z6CpCcTSFHsSoKLeCkCM7YnN9rKrcUy1oDCBqmRdbcC");
    expect(ixs0.accounts.positionMint).toEqual("8mftECF9q77paxx5sVeQvHmgEKBnTQnNr9qCZxq2T61q");
    expect(ixs0.accounts.positionTokenAccount).toEqual("GAe19hxnBcc6tVrJPCxuyTGiNeFCn2YtaCfTuNLitAaA");
    expect(ixs0.accounts.whirlpool).toEqual("66qpjRGxdFWrAtCSdLokofU8Zu5hfHu4JRhDKZkgFxP6");
    expect(ixs0.accounts.token2022Program).toEqual("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
    expect(ixs0.accounts.systemProgram).toEqual("11111111111111111111111111111111");
    expect(ixs0.accounts.associatedTokenProgram).toEqual("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
    expect(ixs0.accounts.metadataUpdateAuth).toEqual("3axbTs2z5GBy6usVbNVoqEgZMng3vZvMnAoX29BFfwhr");
  });

  it("closePositionWithTokenExtensions", async () => {
    const blockJSONFile = "closePositionWithTokenExtensions.json"
    const signature = "3q7KvygmRDJuXo6pgvgiKAeiutPjNuXJDv3qTfHgvP96oD4J3zPMcAi7rqYDYnMd81jW69ezJqVk13fYTPt7co6p";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("closePositionWithTokenExtensions");

    const ixs0 = ixs[0] as DecodedClosePositionWithTokenExtensionsInstruction;

    expect(ixs0.accounts.positionAuthority).toEqual("7f2VEeCiwgnaziV8VecCWVvhhDG9wKPWmyyyAEy9A8zy");
    expect(ixs0.accounts.receiver).toEqual("27gpx7yvD5UU7xDyTLaPodtyDa57xsDb47FouFYgYFD6");
    expect(ixs0.accounts.position).toEqual("HYWTiuUHkCihK8RePabroWTMGmC1kZZEuypkHjEditdS");
    expect(ixs0.accounts.positionMint).toEqual("AyZLfNVhUQi5v9aBBXHH8rTEVu211KtNqvtvtg9w4eoA");
    expect(ixs0.accounts.positionTokenAccount).toEqual("8DidsauoWMLnsxVGL4fU4TcaUdVdNvkxCx7e6vraANYJ");
    expect(ixs0.accounts.token2022Program).toEqual("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
  });

});