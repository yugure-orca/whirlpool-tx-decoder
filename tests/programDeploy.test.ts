import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("Program Deploy Detection", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/programDeploy/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("DeployWithMaxDataLen (Whirlpool Program)", async () => {
    const blockJSONFile = "whirlpoolProgram-deploy-20220309-124152351.json"
    const signature = "4QfHs7WnQfxHYHVSG2L3Bphju9FDKZBvr3Abie57XV2RPDEcbCLnCy8R63pCFcxdQyk7LAsbhT4WPtGj4AzFaWaH";
    const json = getTransactionJSON(blockJSONFile, signature);

    const result = WhirlpoolTransactionDecoder.decodeWithProgramDeployDetection(json, WHIRLPOOL_PROGRAM_ID);
    expect(result.decodedInstructions.length).toEqual(0);
    expect(result.programDeployDetected).toEqual(true);
  });

  it("Upgrade (Whirlpool Program)", async () => {
    const blockJSONFile = "whirlpoolProgram-upgrade-20240902-287352124.json"
    const signature = "5LDEtFBn6cyRYRY6sjiekVU9Pc68BZQMz5jfznpg1sXhueGCUb9LiS8T9SC2xpQpxPs6KNKUB6dvq95oA9sWXM5M";
    const json = getTransactionJSON(blockJSONFile, signature);

    const result = WhirlpoolTransactionDecoder.decodeWithProgramDeployDetection(json, WHIRLPOOL_PROGRAM_ID);
    expect(result.decodedInstructions.length).toEqual(0);
    expect(result.programDeployDetected).toEqual(true);
  });

  it("no BPF Upgradable Loader instruction", async () => {
    const blockJSONFile = "whirlpoolProgram-upgrade-20240902-287352124.json"
    const signature = "5V4WaqtPHJ2KbNTDrS6XF8bNsWqNS7nG99nofxjBPqheYY74hwJe2r7Y6mh7gXjUNqbASb8s21ad2KSpLkUNmiXf";
    const json = getTransactionJSON(blockJSONFile, signature);

    const result = WhirlpoolTransactionDecoder.decodeWithProgramDeployDetection(json, WHIRLPOOL_PROGRAM_ID);
    expect(result.decodedInstructions.length).toEqual(0);
    expect(result.programDeployDetected).toEqual(false);
  });

  it("DeployWithMaxDataLen (Other program)", async () => {
    const blockJSONFile = "phoenixProgram-deploy-20230215-177829317.json"
    const signature = "51HtymMGL5nALQxrARdjt4viwPXgQSePub9eHXM3HNfxh7AKTYPvFSoFNKHExHox4BFa5GzN999AZ7aKmkCyNgAY";
    const json = getTransactionJSON(blockJSONFile, signature);

    const result = WhirlpoolTransactionDecoder.decodeWithProgramDeployDetection(json, WHIRLPOOL_PROGRAM_ID);
    expect(result.decodedInstructions.length).toEqual(0);
    expect(result.programDeployDetected).toEqual(false);

    const resultForPhoenix = WhirlpoolTransactionDecoder.decodeWithProgramDeployDetection(json, "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY");
    expect(resultForPhoenix.decodedInstructions.length).toEqual(0);
    expect(resultForPhoenix.programDeployDetected).toEqual(true);
  });

  it("Upgrade (Other program)", async () => {
    const blockJSONFile = "phoenixProgram-upgrade-20231121-231433470.json"
    const signature = "5CNSvXkmLWPFsREEdXRkuC5kExZruaG6ZQcjpJF2Pnu2JQf27jZ1yDsrGLv5PgboUiESjQSi55FRE7MxoAbnuWVf";
    const json = getTransactionJSON(blockJSONFile, signature);

    const result = WhirlpoolTransactionDecoder.decodeWithProgramDeployDetection(json, WHIRLPOOL_PROGRAM_ID);
    expect(result.decodedInstructions.length).toEqual(0);
    expect(result.programDeployDetected).toEqual(false);

    const resultForPhoenix = WhirlpoolTransactionDecoder.decodeWithProgramDeployDetection(json, "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY");
    expect(resultForPhoenix.decodedInstructions.length).toEqual(0);
    expect(resultForPhoenix.programDeployDetected).toEqual(true);
  });
});