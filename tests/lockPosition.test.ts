import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedLockPositionInstruction, TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("Lock Position", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/lockPosition/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("lockPosition (lockType = Permanent)", async () => {
    const blockJSONFile = "lockPositionPermanent.json"
    const signature = "LV5W79nWLSW52BdGC6nMzk56cdJSP2Ny6LAGWZ37fbfygryRcRAZgJVNd6ntnvdwbiyR4wNGvrCtcXV25stkHmi";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("lockPosition");

    const ixs0 = ixs[0] as DecodedLockPositionInstruction;

    expect(ixs0.data.lockType.name).toEqual("permanent");
    expect(ixs0.accounts.funder).toEqual("r21Gamwd9DtyjHeGywsneoQYR39C1VDwrw7tWxHAwh6");
    expect(ixs0.accounts.positionAuthority).toEqual("r21Gamwd9DtyjHeGywsneoQYR39C1VDwrw7tWxHAwh6");
    expect(ixs0.accounts.position).toEqual("AZDEtuUFoTw8sYVGtoQ7QTfECuEmqK12u7jySxjnWniW");
    expect(ixs0.accounts.positionMint).toEqual("5n7LyyXbrNb8DP1of5iqkttChGeiB5Gdmw6SMUnfJcCX");
    expect(ixs0.accounts.positionTokenAccount).toEqual("47iTg4SSsGkB7tBcW8vxUJmXdwSEHMtSZ8F6F1a5C4y9");
    expect(ixs0.accounts.lockConfig).toEqual("7eVtyakZCcuJCxRrR7e3VZfgkVJNtpaQPrxXFHdzeJx2");
    expect(ixs0.accounts.whirlpool).toEqual("AjXKJft9La1KyMRqmMDDv5oSQ9Kv4CyBGLW3dZeC8xKw");
    expect(ixs0.accounts.token2022Program).toEqual("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
    expect(ixs0.accounts.systemProgram).toEqual("11111111111111111111111111111111");

    const lockTypeJsonString = JSON.stringify(ixs0.data.lockType);
    expect(lockTypeJsonString).toEqual('{"name":"permanent"}');
  });

});