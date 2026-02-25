import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedSetConfigFeatureFlagInstruction, DecodedSetTokenBadgeAttributeInstruction, TransactionJSON } from "../src/types";
import { jsonifyEnum } from "./utils";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("Non Transferable Position", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/nonTransferablePosition/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("setConfigFeatureFlag (TokenBadge = true)", async () => {
    const blockJSONFile = "setConfigFeatureFlag-TokenBadge-true.json"
    const signature = "67nWuhEZ8JKM6Wn94S4JFhd8fKkfuVm9eiCxUbnXaxErx7VeDmsRseDSvbDL4YEJykinrZqEoKFRcvHpeVPZbaSr";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("setConfigFeatureFlag");

    const ixs0 = ixs[0] as DecodedSetConfigFeatureFlagInstruction;

    expect(ixs0.data.featureFlag.name).toEqual("tokenBadge");
    expect(ixs0.data.featureFlag.enabled).toEqual(true);
    expect(ixs0.accounts.whirlpoolsConfig).toEqual("2whzE4Lrzjp1eLAHoWDBsA1m42A2kTM4QV8d1dAwsYEr");
    expect(ixs0.accounts.authority).toEqual("tstYmkF9JHjZbSugJe1H3ygUTox1bqSxpn5QjxMwVrm");

    const featureFlagJsonString = jsonifyEnum(ixs0.data.featureFlag);
    expect(featureFlagJsonString).toEqual('{"name":"tokenBadge","enabled":true}');
  });

  it("setConfigFeatureFlag (TokenBadge = false)", async () => {
    const blockJSONFile = "setConfigFeatureFlag-TokenBadge-false.json"
    const signature = "2ofp39f9qJthLTdf9xo4Uc9TdHAA2ugjHPLxTK2MPJY9cjw5nNiKxEmqSDA9sNtWC2NtGXRmJ7XGZJssYBcPL5n7";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("setConfigFeatureFlag");

    const ixs0 = ixs[0] as DecodedSetConfigFeatureFlagInstruction;

    expect(ixs0.data.featureFlag.name).toEqual("tokenBadge");
    expect(ixs0.data.featureFlag.enabled).toEqual(false);
    expect(ixs0.accounts.whirlpoolsConfig).toEqual("2whzE4Lrzjp1eLAHoWDBsA1m42A2kTM4QV8d1dAwsYEr");
    expect(ixs0.accounts.authority).toEqual("tstYmkF9JHjZbSugJe1H3ygUTox1bqSxpn5QjxMwVrm");

    const featureFlagJsonString = jsonifyEnum(ixs0.data.featureFlag);
    expect(featureFlagJsonString).toEqual('{"name":"tokenBadge","enabled":false}');
  });

  it("setTokenBadgeAttribute (RequireNonTransferablePosition = true)", async () => {
    const blockJSONFile = "setTokenBadgeAttribute-nonTransferablePosition-true.json"
    const signature = "4zRsYbkGHiqea73yCSpaZUf8p2zyNKVD2ojhzGVco2iSejugQpmnjVvMpu1Rbzw8V5g74pZzf4217GRF7K29AVJs";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("setTokenBadgeAttribute");

    const ixs0 = ixs[0] as DecodedSetTokenBadgeAttributeInstruction;

    expect(ixs0.data.attribute.name).toEqual("requireNonTransferablePosition");
    expect(ixs0.data.attribute.required).toEqual(true);
    expect(ixs0.accounts.whirlpoolsConfig).toEqual("D6PzbzyiXqyHQ5ux3ttj5tBYsMiMkfXqWKFymPcjJcYE");
    expect(ixs0.accounts.whirlpoolsConfigExtension).toEqual("Bq1eGwMPXfmK6UuovmvaEZyCS1YgWucEGrk16SW92eHB");
    expect(ixs0.accounts.tokenBadgeAuthority).toEqual("8iVB7wuduy2ohvz7fgpAUeZHcvLhvsVMZpDaKFJsjFkL");
    expect(ixs0.accounts.tokenMint).toEqual("93E3X5fxnqB1iL7K1wT3nHHVFgRfF2F55HEQgDq8BdEu");
    expect(ixs0.accounts.tokenBadge).toEqual("D8DBqtte4WobaPjEr1bNKiK5LuzrKWX65gs2KrQKDkBC");

    const attributeJsonString = jsonifyEnum(ixs0.data.attribute);
    expect(attributeJsonString).toEqual('{"name":"requireNonTransferablePosition","required":true}');
  });

  it("setTokenBadgeAttribute (RequireNonTransferablePosition = false)", async () => {
    const blockJSONFile = "setTokenBadgeAttribute-nonTransferablePosition-false.json"
    const signature = "YvSKHPuy16quS5XoowT2nt3sLyjnMenm4yrzy6bewkX27iRQd9PBGDChLGYHXTYTFJVNKKfsvRYC7ggEnMAZjBH";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("setTokenBadgeAttribute");

    const ixs0 = ixs[0] as DecodedSetTokenBadgeAttributeInstruction;

    expect(ixs0.data.attribute.name).toEqual("requireNonTransferablePosition");
    expect(ixs0.data.attribute.required).toEqual(false);
    expect(ixs0.accounts.whirlpoolsConfig).toEqual("D6PzbzyiXqyHQ5ux3ttj5tBYsMiMkfXqWKFymPcjJcYE");
    expect(ixs0.accounts.whirlpoolsConfigExtension).toEqual("Bq1eGwMPXfmK6UuovmvaEZyCS1YgWucEGrk16SW92eHB");
    expect(ixs0.accounts.tokenBadgeAuthority).toEqual("8iVB7wuduy2ohvz7fgpAUeZHcvLhvsVMZpDaKFJsjFkL");
    expect(ixs0.accounts.tokenMint).toEqual("93E3X5fxnqB1iL7K1wT3nHHVFgRfF2F55HEQgDq8BdEu");
    expect(ixs0.accounts.tokenBadge).toEqual("D8DBqtte4WobaPjEr1bNKiK5LuzrKWX65gs2KrQKDkBC");

    const attributeJsonString = jsonifyEnum(ixs0.data.attribute);
    expect(attributeJsonString).toEqual('{"name":"requireNonTransferablePosition","required":false}');
  });
});
