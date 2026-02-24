import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedRepositionLiquidityV2Instruction, TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("Reposition Liquidity V2", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/repositionLiquidityV2/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  it("byLiquidity", async () => {
    const blockJSONFile = "repositionLiquidityV2-byLiquidity.json"
    const signature = "5pTMgSeqxqwjmDNJLuNf6LuUQqSLzoHtnP4SGpMoEcPr9NdntoyXWnnsCK14FRV8f641Hqg6GzfSM7qaxvNdLKBe";
    const json = getTransactionJSON(blockJSONFile, signature);

    const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
    expect(ixs.length).toEqual(1);
    expect(ixs[0].name).toEqual("repositionLiquidityV2");

    const ixs0 = ixs[0] as DecodedRepositionLiquidityV2Instruction;

    expect(ixs0.data.newTickUpperIndex).toEqual(-35712);
    expect(ixs0.data.newTickLowerIndex).toEqual(-35776);
    expect(ixs0.data.method.name).toEqual("byLiquidity");
    expect(ixs0.data.method.newLiquidityAmount.toString()).toEqual("93468635752");
    expect(ixs0.data.method.existingRangeTokenMinA.toString()).toEqual("0");
    expect(ixs0.data.method.existingRangeTokenMinB.toString()).toEqual("100");
    expect(ixs0.data.method.newRangeTokenMaxA.toString()).toEqual("1000000000");
    expect(ixs0.data.method.newRangeTokenMaxB.toString()).toEqual("300000000");
    expect(ixs0.data.remainingAccountsInfo.length).toEqual(0);
    expect(ixs0.accounts.whirlpool).toEqual("966HQTB3CKAL6AzqueVo3mFkaEiePCFLoGWXetoxBTH2");
    expect(ixs0.accounts.tokenProgramA).toEqual("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    expect(ixs0.accounts.tokenProgramB).toEqual("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    expect(ixs0.accounts.memoProgram).toEqual("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
    expect(ixs0.accounts.positionAuthority).toEqual("r21Gamwd9DtyjHeGywsneoQYR39C1VDwrw7tWxHAwh6");
    expect(ixs0.accounts.funder).toEqual("r21Gamwd9DtyjHeGywsneoQYR39C1VDwrw7tWxHAwh6");
    expect(ixs0.accounts.position).toEqual("9keZBHVEBWe2uWyCXWyzLRvyP7P3LpUGWof3CTV566WJ");
    expect(ixs0.accounts.positionTokenAccount).toEqual("7yJzthuoTo1gctZ8Qv6SjAdeabefVMFVRec2b6i8iVwx");
    expect(ixs0.accounts.tokenMintA).toEqual("So11111111111111111111111111111111111111112");
    expect(ixs0.accounts.tokenMintB).toEqual("BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k");
    expect(ixs0.accounts.tokenOwnerAccountA).toEqual("3sDLkZQoCiqGHquJtSL3Ti2M46PzNB73RiFVHfTc6iag");
    expect(ixs0.accounts.tokenOwnerAccountB).toEqual("3ZBThPKT5i5YiUL9QwhR6Qrxhmn5Sgz4RB4mMuZQCAv7");
    expect(ixs0.accounts.tokenVaultA).toEqual("HCExg9kzWMsLTqF6MqYJtC2oxyLop2FffwAiraCenoXS");
    expect(ixs0.accounts.tokenVaultB).toEqual("HnEmvKUYXznamehQfgAfXDng84Rpz3oVsmfP3PqiaSm1");
    expect(ixs0.accounts.existingTickArrayLower).toEqual("D8yPeo4pfHJnKKhxs2AFnKb9QutJomJQAAJooJq6z6fv");
    expect(ixs0.accounts.existingTickArrayUpper).toEqual("D8yPeo4pfHJnKKhxs2AFnKb9QutJomJQAAJooJq6z6fv");
    expect(ixs0.accounts.newTickArrayLower).toEqual("D8yPeo4pfHJnKKhxs2AFnKb9QutJomJQAAJooJq6z6fv");
    expect(ixs0.accounts.newTickArrayUpper).toEqual("D8yPeo4pfHJnKKhxs2AFnKb9QutJomJQAAJooJq6z6fv");
    expect(ixs0.accounts.systemProgram).toEqual("11111111111111111111111111111111");
    expect(ixs0.transfers.length).toEqual(2);
    expect(ixs0.transfers[0].amount.toString()).toEqual("0");
    expect(ixs0.transfers[0].transferFeeConfig).toBeNull();
    expect(ixs0.auxiliaries.isTokenATransferFromOwner).toEqual(true);
    expect(ixs0.transfers[1].amount.toString()).toEqual("49920259");
    expect(ixs0.transfers[1].transferFeeConfig).toBeNull();
    expect(ixs0.auxiliaries.isTokenBTransferFromOwner).toEqual(false);
  });

});