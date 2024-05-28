import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("v2", () => {

  beforeAll(async () => {
  });

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("collectFeesV2 + MemoTransfer", async () => {
    const blockJSONFile = "collectFeesV2+MemoTransfer.json"
    const signature = "fLDXfjg6mCwpAjLN2ZSurcXM7FWyaj2aUXX12Dk6XTLrvvGo6zyeMwUhDwi8UNXW9xAA1zj9zefvEsR1s3dEm8x";

    const json = getTransactionJSON(blockJSONFile, signature);
    const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    console.log(JSON.stringify(x, null, 2));
  });

  it("collectFeesV2 + TransferHook", async () => {
    const blockJSONFile = "collectFeesV2+TransferHook.json"
    const signature = "2Mn89vBT5vcUeSkcxByg3Ys9T1jEqpM6A1d78RAKufzdWprMr7jVnu6P8ouNZ761TNzikAuVij9RneLGm5szChHy";

    const json = getTransactionJSON(blockJSONFile, signature);
    const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    console.log(JSON.stringify(x, null, 2));
  });

  it("collectFeesV2 + TransferFee", async () => {
    const blockJSONFile = "collectFeesV2+TransferFee.json"
    const signature = "3ZcS2FEVBxLKWXU4qAVFNZKy5CYge9vyHzFYC5W8No1Kgjum8DK37YiP7bfi3Ws7ezjSz5L6skyuwViV4VgUCckT";

    const json = getTransactionJSON(blockJSONFile, signature);
    const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    console.log(JSON.stringify(x, null, 2));
  });

  it("collectFeesV2 + TransferFee + MemoTransfer", async () => {
    const blockJSONFile = "collectFeesV2+TransferFee+MemoTransfer.json"
    const signature = "T3iDZv72oU13vxHSwUR5eKftnUTZ1jG8jHsQLoeA5HJRUC79MCWi4mFfdmS89pJcMozAD8UnAsZh14Scwii58Ke";

    const json = getTransactionJSON(blockJSONFile, signature);
    const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    console.log(JSON.stringify(x, null, 2));
  });

});