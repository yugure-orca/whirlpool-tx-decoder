import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedMigrateRepurposeRewardAuthoritySpaceInstruction, TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("Migration", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/migration/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("migrateRepurposeRewardAuthoritySpace", async () => {
    const blockJSONFile = "migrateRepurposeRewardAuthoritySpace.json"
    const signature = "kJymaS8Bb4hDzRZdh2EPBUL2ZS8XibpSx5Ups6mrRb8v5x1xHqVfytvahN2Z95Wx3xk6wmP7PeyzQmfFVcHk9wE";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("migrateRepurposeRewardAuthoritySpace");

    const ixs0 = ixs[0] as DecodedMigrateRepurposeRewardAuthoritySpaceInstruction;

    expect(ixs0.accounts.whirlpool).toEqual("7vWRTPPBq3aNaJZsrfterTz1BSjht4YSHBXJwnbuV6SC");
  });
});
