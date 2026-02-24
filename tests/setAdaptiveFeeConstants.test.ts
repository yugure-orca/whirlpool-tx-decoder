import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedSetAdaptiveFeeConstantsInstruction, TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("Set Adaptive Fee Constants", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/setAdaptiveFeeConstants/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("full update", async () => {
    const blockJSONFile = "setAdaptiveFeeConstants-full.json"
    const signature = "2afdjGJ1eoxSeTa55Bn8v8Z3SAxMRrmQk6Akd9udQiRBbCbtMnK5n1hhme7rFecquXHsvGZZafTTFLwzBSCvtteF";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("setAdaptiveFeeConstants");

    const ixs0 = ixs[0] as DecodedSetAdaptiveFeeConstantsInstruction;

    expect(ixs0.data.filterPeriod).toEqual(30);
    expect(ixs0.data.decayPeriod).toEqual(660);
    expect(ixs0.data.reductionFactor).toEqual(5000);
    expect(ixs0.data.adaptiveFeeControlFactor).toEqual(40000);
    expect(ixs0.data.maxVolatilityAccumulator).toEqual(100000);
    expect(ixs0.data.tickGroupSize).toEqual(64);
    expect(ixs0.data.majorSwapThresholdTicks).toEqual(64);
    expect(ixs0.accounts.whirlpoolsConfig).toEqual("FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR");
    expect(ixs0.accounts.whirlpool).toEqual("966HQTB3CKAL6AzqueVo3mFkaEiePCFLoGWXetoxBTH2");
    expect(ixs0.accounts.feeAuthority).toEqual("3otH3AHWqkqgSVfKFkrxyDqd2vK6LcaqigHrFEmWcGuo");
    expect(ixs0.accounts.oracle).toEqual("ETu2xvY2zVKKfeQamani671qrvBxx7YPnKemji8HjdUo");
  });

  it("partial update", async () => {
    const blockJSONFile = "setAdaptiveFeeConstants-partial.json"
    const signature = "FVH6m5tFRSso91yM7HMLw3ZuBbEUpFQfzRPGP1TmW4vqVMsZZ7V3LgSssobqWiebbaq8neFb2pFvxJoMfX7hqVN";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("setAdaptiveFeeConstants");

    const ixs0 = ixs[0] as DecodedSetAdaptiveFeeConstantsInstruction;

    expect(ixs0.data.filterPeriod).toBeNull();
    expect(ixs0.data.decayPeriod).toEqual(660);
    expect(ixs0.data.reductionFactor).toBeNull();
    expect(ixs0.data.adaptiveFeeControlFactor).toEqual(40000);
    expect(ixs0.data.maxVolatilityAccumulator).toBeNull()
    expect(ixs0.data.tickGroupSize).toEqual(64);
    expect(ixs0.data.majorSwapThresholdTicks).toEqual(128);
    expect(ixs0.accounts.whirlpoolsConfig).toEqual("FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR");
    expect(ixs0.accounts.whirlpool).toEqual("966HQTB3CKAL6AzqueVo3mFkaEiePCFLoGWXetoxBTH2");
    expect(ixs0.accounts.feeAuthority).toEqual("3otH3AHWqkqgSVfKFkrxyDqd2vK6LcaqigHrFEmWcGuo");
    expect(ixs0.accounts.oracle).toEqual("ETu2xvY2zVKKfeQamani671qrvBxx7YPnKemji8HjdUo");
  });

});