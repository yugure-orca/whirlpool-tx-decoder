import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedAdminIncreaseLiquidityInstruction, DecodedClosePositionWithTokenExtensionsInstruction, DecodedOpenPositionWithTokenExtensionsInstruction, DecodedSwapV2Instruction, DecodedTwoHopSwapV2Instruction, TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("AdminIncreaseLiquidity", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/adminIncreaseLiquidity/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("whETH/USDC", async () => {
    const blockJSONFile = "wheth-usdc-168118080.json"
    const signature = "44wFosGvqDbgyMJMJyKHAA7kRXBHTUEz9vz1BSGDpoqrx7UGqAYUgudsUzfx1zjbrQf6hycaYQRyNSyfxp2MCQzA";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("adminIncreaseLiquidity");

    const ixs0 = ixs[0] as DecodedAdminIncreaseLiquidityInstruction;

    expect(ixs0.data.liquidity.toString()).toEqual("18126802844");
    expect(ixs0.accounts.whirlpoolsConfig).toEqual("2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ");
    expect(ixs0.accounts.whirlpool).toEqual("E5KuHFnU2VuuZFKeghbTLazgxeni4dhQ7URE4oBtJju2");
    expect(ixs0.accounts.authority).toEqual("3Pi4tc4SxZyKZivKxWnYfGNxeqFJJxPc8xRw1VnvXpbb");
  });

  it("soBTC/USDC", async () => {
    const blockJSONFile = "sobtc-usdc-168118807.json"
    const signature = "4vto7KJBeMoixSJKYoPxP7N1Y5cAp6WtUJKtuRucCT7U4FrjMGZ8LMFb1W8GbuhgUSJiwfi3HGjChA26zWURyJDL";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("adminIncreaseLiquidity");

    const ixs0 = ixs[0] as DecodedAdminIncreaseLiquidityInstruction;

    expect(ixs0.data.liquidity.toString()).toEqual("18504045");
    expect(ixs0.accounts.whirlpoolsConfig).toEqual("2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ");
    expect(ixs0.accounts.whirlpool).toEqual("4nznvbZ1jPXJM7CJebwh1aWXGrzydPwWFNXoL81f3Rnn");
    expect(ixs0.accounts.authority).toEqual("3Pi4tc4SxZyKZivKxWnYfGNxeqFJJxPc8xRw1VnvXpbb");
  });

});