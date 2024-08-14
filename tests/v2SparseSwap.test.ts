import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedSwapV2Instruction, DecodedTwoHopSwapV2Instruction, TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("v2 SparseSwap", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/sparseSwap/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("swapV2 + 3 Supplemental TickArrays", async () => {
    const blockJSONFile = "swapV2+Supplemental.json"
    const signature = "4ShdYSjgmwZCLUw3aDwZUKeczazX8DPqgibkQenR3v46fNnooMao2ExmKyuKKHjrhpHQhJG8vJMxDRCMPTvF5YRS";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("swapV2");
    expect((ixs[0] as DecodedSwapV2Instruction).data.remainingAccountsInfo.length).toEqual(1);
    expect((ixs[0] as DecodedSwapV2Instruction).data.remainingAccountsInfo[0].accountsType).toEqual(6); // SupplementalTickArray
    expect((ixs[0] as DecodedSwapV2Instruction).data.remainingAccountsInfo[0].length).toEqual(3);
    expect((ixs[0] as DecodedSwapV2Instruction).remainingAccounts.length).toEqual(3);
    expect((ixs[0] as DecodedSwapV2Instruction).remainingAccounts[0]).toEqual("2WbZNQMXw4Bi4feRdTFi4x4NKY8E4aEHxJqmKC3GLuvU");
    expect((ixs[0] as DecodedSwapV2Instruction).remainingAccounts[1]).toEqual("ARS6qVm99AVpus7FwmV7utEME1pjbyiRRgLaJMmDrQzb");
    expect((ixs[0] as DecodedSwapV2Instruction).remainingAccounts[2]).toEqual("9C3NPuBciQB2nCjySJJTyfQeCx7PXYQ1bbLMdj44sr3v");
  });

  it("twoHopSwapV2 + 3 Supplemental TickArrays", async () => {
    const blockJSONFile = "twoHopSwapV2+Supplemental.json"
    const signature = "5kHDKFQJ2xovfHqd2PisZ7NtRbzmDjw2fEmJHFdTt5uqJRxp9Ks9ujN9CxJkgmCZqkzfkf5ab7Vxy5JLfVx758WU";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("twoHopSwapV2");
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo.length).toEqual(2);
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo[0].accountsType).toEqual(7); // SupplementalTickArrayOne
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo[0].length).toEqual(3);
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo[1].accountsType).toEqual(8); // SupplementalTickArrayTwo
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo[1].length).toEqual(3);
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).remainingAccounts.length).toEqual(6);
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).remainingAccounts[0]).toEqual("G2Vk263sXZWyFQAgkt2aj3JKHF7T8P7aQdNvFx9EEBvj");
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).remainingAccounts[1]).toEqual("GL8mtwJLzzBrFUx1rhqXeFThGEnsUYkieTQqNkdKjFdZ");
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).remainingAccounts[2]).toEqual("ExjzW7UuGGJXbooThEeDh26XUCdTW1SBuGxcHirpRRUS");
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).remainingAccounts[3]).toEqual("BZeJZF15dcwSEotVWf5JqEVd3AYN9irx9yxEhewAgXwe");
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).remainingAccounts[4]).toEqual("7iRBWtg2Xi3SjKvtn64EKNc6sfpw5xp9u2rGge5W2gDj");
    expect((ixs[0] as DecodedTwoHopSwapV2Instruction).remainingAccounts[5]).toEqual("CX1QkZRqQfE9tgtZHxKtqqq3Bz3rD3gfy6DXvvr3n1Yu");
  });

});