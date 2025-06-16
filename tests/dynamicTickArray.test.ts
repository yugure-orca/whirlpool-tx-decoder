import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedInitializeDynamicTickArrayInstruction, TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("Dynamic Tick Array", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/dynamicTickArray/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("initializeDynamicTickArray", async () => {
    const blockJSONFile = "initializeDynamicTickArray.json"
    const signature = "5qsohPWiHwYAeTkKgJUNDjPXy5pgKDEqsf7CZMMSat2LXhin7bibfyJYwJ9VEXzcMAWFbD4whxSS8sdGsm3qmVc6";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(6);
    expect(ixs[1].name).toEqual("initializeDynamicTickArray");

    const ixs1 = ixs[1] as DecodedInitializeDynamicTickArrayInstruction;

    expect(ixs1.data.startTickIndex).toEqual(67584);
    expect(ixs1.data.idempotent).toEqual(false);
    expect(ixs1.accounts.whirlpool).toEqual("CCeddKuXVdV8QPfhnxMjRYjQ9MyN4aNqJ2ELVsVj4piX");
    expect(ixs1.accounts.funder).toEqual("9ar6ByCBqCYyH7VWSNah7h5hR2FcHtig5Dnhcq5UTFR7");
    expect(ixs1.accounts.tickArray).toEqual("EHtXA1XLXstmpfvUimpY82x8XLpJxat9hyBUvmu7EoVy");
    expect(ixs1.accounts.systemProgram).toEqual("11111111111111111111111111111111");
  });
  
});