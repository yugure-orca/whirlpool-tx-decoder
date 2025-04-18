import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedResetPositionRangeInstruction, TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("Reset Position Range", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/resetPositionRange/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("resetPositionRange", async () => {
    const blockJSONFile = "resetPositionRange.json"
    const signature = "4X19BHoDAxc1JhWi8h2mmEKyE6Q3gMXGCRSk16CZdd5mHtbNRbyTz8eWtSJSAhh2REo9owkyAejUuNLCgBGnGxWs";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("resetPositionRange");

    const ixs0 = ixs[0] as DecodedResetPositionRangeInstruction;

    expect(ixs0.data.newTickLowerIndex).toEqual(0 + 128);
    expect(ixs0.data.newTickUpperIndex).toEqual(32768 - 128);
    expect(ixs0.accounts.funder).toEqual("2zdbefbkwnoiHxnoHYBv7LTZt8RD22PArkJZ2PrT1Lof");
    expect(ixs0.accounts.positionAuthority).toEqual("3otH3AHWqkqgSVfKFkrxyDqd2vK6LcaqigHrFEmWcGuo");
    expect(ixs0.accounts.whirlpool).toEqual("CENFb8aiD2tekMqfkDUGpcCs12efvQfxq4NepeiJSqVo");
    expect(ixs0.accounts.position).toEqual("Foa79xK6FC8RE55BH7DAs6NqmcKvtVvkjW8VqA8izPtx");
    expect(ixs0.accounts.positionTokenAccount).toEqual("FAv2tqTyAQim3bBbmqbBmedrKvAYqiHVGeiTLqE4eVvj");
    expect(ixs0.accounts.systemProgram).toEqual("11111111111111111111111111111111");
  });

});