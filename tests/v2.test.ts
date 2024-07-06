import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { DecodedCollectFeesV2Instruction, DecodedCollectProtocolFeesV2Instruction, DecodedCollectRewardV2Instruction, DecodedDecreaseLiquidityV2Instruction, DecodedIncreaseLiquidityV2Instruction, DecodedInitializePoolV2Instruction, DecodedInitializeRewardV2Instruction, DecodedSwapV2Instruction, DecodedTwoHopSwapV2Instruction, TransactionJSON } from "../src/types";

jest.setTimeout(100 * 1000 /* ms */);

// JSON.stringify(BigInt) patch
(BigInt.prototype as any).toJSON = function () { return `${this.toString()}n`; };

const WHIRLPOOL_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";

describe("v2", () => {

  function getTransactionJSON(blockJSONFile: string, signature: string): TransactionJSON {
    const json = require(`./data/${blockJSONFile}`);
    return { result: json.result.transactions.filter((tx: any) => tx.transaction.signatures[0] === signature)[0] };
  }

  describe("collectFeesV2", () => {
    it("collectFeesV2 - Token/Token", async () => {
      const blockJSONFile = "collectFeesV2+TokenToken.json"
      const signature = "2BmpLsPTkZWUPd4izRXxzQgxnWGReP9KY6Yst11BGmXFK4oT66T4higUDicUrTaoYMcQJGhu8CphJxrcixNoshdj";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("collectFeesV2");
      expect((ixs[0] as DecodedCollectFeesV2Instruction).data.remainingAccountsInfo.length).toEqual(0);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).remainingAccounts.length).toEqual(0);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers.length).toEqual(2);
      // TransferFeeConfig extension is not initialized
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[0].transferFeeConfig).toBeNull();
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[1].transferFeeConfig).toBeNull();
      //console.log(JSON.stringify(ixs, null, 2));
    });

    it("collectFeesV2 + MemoTransfer", async () => {
      const blockJSONFile = "collectFeesV2+MemoTransfer.json"
      const signature = "fLDXfjg6mCwpAjLN2ZSurcXM7FWyaj2aUXX12Dk6XTLrvvGo6zyeMwUhDwi8UNXW9xAA1zj9zefvEsR1s3dEm8x";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("collectFeesV2");
      expect((ixs[0] as DecodedCollectFeesV2Instruction).data.remainingAccountsInfo.length).toEqual(0);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).remainingAccounts.length).toEqual(0);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers.length).toEqual(2);
      // TransferFeeConfig extension is not initialized
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[0].transferFeeConfig).toBeNull();
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[1].transferFeeConfig).toBeNull();
      //console.log(JSON.stringify(ixs, null, 2));
    });

    it("collectFeesV2 + TransferHook", async () => {
      const blockJSONFile = "collectFeesV2+TransferHook.json"
      const signature = "2Mn89vBT5vcUeSkcxByg3Ys9T1jEqpM6A1d78RAKufzdWprMr7jVnu6P8ouNZ761TNzikAuVij9RneLGm5szChHy";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("collectFeesV2");
      expect((ixs[0] as DecodedCollectFeesV2Instruction).data.remainingAccountsInfo.length).toEqual(2);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).data.remainingAccountsInfo[0].accountsType).toEqual(0); // TransferHookA
      expect((ixs[0] as DecodedCollectFeesV2Instruction).data.remainingAccountsInfo[0].length).toEqual(3);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).data.remainingAccountsInfo[1].accountsType).toEqual(1); // TransferHookB
      expect((ixs[0] as DecodedCollectFeesV2Instruction).data.remainingAccountsInfo[1].length).toEqual(3);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).remainingAccounts.length).toEqual(6);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers.length).toEqual(2);
      // TransferFeeConfig extension is not initialized
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[0].transferFeeConfig).toBeNull();
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[1].transferFeeConfig).toBeNull();
      //console.log(JSON.stringify(ixs, null, 2));
    });

    it("collectFeesV2 + TransferFee", async () => {
      const blockJSONFile = "collectFeesV2+TransferFee.json"
      const signature = "3ZcS2FEVBxLKWXU4qAVFNZKy5CYge9vyHzFYC5W8No1Kgjum8DK37YiP7bfi3Ws7ezjSz5L6skyuwViV4VgUCckT";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("collectFeesV2");
      expect((ixs[0] as DecodedCollectFeesV2Instruction).data.remainingAccountsInfo.length).toEqual(0);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).remainingAccounts.length).toEqual(0);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers.length).toEqual(2);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[0].transferFeeConfig.basisPoints).toEqual(500);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[0].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[1].transferFeeConfig.basisPoints).toEqual(1000);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[1].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      //console.log(JSON.stringify(ixs, null, 2));
    });

    it("collectFeesV2 + TransferFee + MemoTransfer", async () => {
      const blockJSONFile = "collectFeesV2+TransferFee+MemoTransfer.json"
      const signature = "T3iDZv72oU13vxHSwUR5eKftnUTZ1jG8jHsQLoeA5HJRUC79MCWi4mFfdmS89pJcMozAD8UnAsZh14Scwii58Ke";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("collectFeesV2");
      expect((ixs[0] as DecodedCollectFeesV2Instruction).data.remainingAccountsInfo.length).toEqual(0);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).remainingAccounts.length).toEqual(0);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers.length).toEqual(2);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[0].transferFeeConfig.basisPoints).toEqual(500);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[0].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[1].transferFeeConfig.basisPoints).toEqual(1000);
      expect((ixs[0] as DecodedCollectFeesV2Instruction).transfers[1].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      //console.log(JSON.stringify(ixs, null, 2));
    });

    it("collectFeesV2 + TransferHook (multiple instruction)", async () => {
      const blockJSONFile = "collectFeesV2+TransferHook+multiple.json"
      const signature = "4gPMYUsSKbCZ21Wcv6ht1JHUAp3smxa4BCNBSbJxTjJAUkrzJxj6SJoSPEdLuD3EuTQ9aTW5LJGm82GoXfmcDsNs";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(5);
      for (const ix of ixs) {
        expect(ix.name).toEqual("collectFeesV2");
        expect((ix as DecodedCollectFeesV2Instruction).remainingAccounts.length).toEqual(6);
        expect((ix as DecodedCollectFeesV2Instruction).transfers.length).toEqual(2);
      }
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("collectProtocolFeesV2", () => {
    it("collectProtocolFeesV2 + TransferFee", async () => {
      const blockJSONFile = "collectProtocolFeesV2+TransferFee.json"
      const signature = "3epC7jG3bnYcudNgMdFG2sawY7oYBqHsDUs9y5uc1zKuZLo2NLZ64YpzGufURTYHHQgEqSUUbZvwHbNsJG9F5wHN";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("collectProtocolFeesV2");
      expect((ixs[0] as DecodedCollectProtocolFeesV2Instruction).data.remainingAccountsInfo.length).toEqual(0);
      expect((ixs[0] as DecodedCollectProtocolFeesV2Instruction).remainingAccounts.length).toEqual(0);
      expect((ixs[0] as DecodedCollectProtocolFeesV2Instruction).transfers.length).toEqual(2);
      expect((ixs[0] as DecodedCollectProtocolFeesV2Instruction).transfers[0].transferFeeConfig.basisPoints).toEqual(500);
      expect((ixs[0] as DecodedCollectProtocolFeesV2Instruction).transfers[0].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      expect((ixs[0] as DecodedCollectProtocolFeesV2Instruction).transfers[1].transferFeeConfig.basisPoints).toEqual(1000);
      expect((ixs[0] as DecodedCollectProtocolFeesV2Instruction).transfers[1].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("collectRewardV2", () => {
    it("collectRewardV2 + TransferFee", async () => {
      const blockJSONFile = "collectRewardV2+TransferFee.json"
      const signature = "2k4z3NF5bNcNrNoLnEyv6sSVP1yNbmxVHXhmTwkhM6yaQE5UPKMo3oVnT5jeBTo9nMrqreGUQ6sLrGsesLCdFx22";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("collectRewardV2");
      expect((ixs[0] as DecodedCollectRewardV2Instruction).data.rewardIndex).toEqual(2);
      expect((ixs[0] as DecodedCollectRewardV2Instruction).data.remainingAccountsInfo.length).toEqual(0);
      expect((ixs[0] as DecodedCollectRewardV2Instruction).remainingAccounts.length).toEqual(0);
      expect((ixs[0] as DecodedCollectRewardV2Instruction).transfers.length).toEqual(1);
      expect((ixs[0] as DecodedCollectRewardV2Instruction).transfers[0].transferFeeConfig.basisPoints).toEqual(5000);
      expect((ixs[0] as DecodedCollectRewardV2Instruction).transfers[0].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      //console.log(JSON.stringify(ixs, null, 2));
    });

    it("collectRewardV2 + TransferHook", async () => {
      const blockJSONFile = "collectRewardV2+TransferHook.json"
      const signature = "5fpxz4dkdH4VvtRaWa9MgGEyv1DDJzDHbhkzXUEKJwtkqcgfCdfBQtKzUbrbRKE1deVtUsoVX7xaXvjhDCp1K9qU";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("collectRewardV2");
      expect((ixs[0] as DecodedCollectRewardV2Instruction).data.rewardIndex).toEqual(2);
      expect((ixs[0] as DecodedCollectRewardV2Instruction).data.remainingAccountsInfo.length).toEqual(1);
      expect((ixs[0] as DecodedCollectRewardV2Instruction).data.remainingAccountsInfo[0].accountsType).toEqual(2); // TransferHookReward
      expect((ixs[0] as DecodedCollectRewardV2Instruction).data.remainingAccountsInfo[0].length).toEqual(3);
      expect((ixs[0] as DecodedCollectRewardV2Instruction).remainingAccounts.length).toEqual(3);
      expect((ixs[0] as DecodedCollectRewardV2Instruction).transfers.length).toEqual(1);
      // TransferFeeConfig extension is not initialized
      expect((ixs[0] as DecodedCollectRewardV2Instruction).transfers[0].transferFeeConfig).toBeNull();
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("increaseLiquidityV2", () => {
    it("increaseLiquidityV2 + TransferFee", async () => {
      const blockJSONFile = "increaseLiquidityV2+TransferFee.json"
      const signature = "3wSj2iLsx2iL8zEjFohtAagKtyJENHt1e8rEnqgobG29PtNon8zNw48osidP2SUyYwNBjTKqp9gUGDHbA9D8Kb5V";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("increaseLiquidityV2");
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).data.remainingAccountsInfo.length).toEqual(0);
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).remainingAccounts.length).toEqual(0);
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).transfers.length).toEqual(2);
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).transfers[0].transferFeeConfig.basisPoints).toEqual(500);
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).transfers[0].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).transfers[1].transferFeeConfig.basisPoints).toEqual(1000);
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).transfers[1].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      //console.log(JSON.stringify(ixs, null, 2));
    });

    it("increaseLiquidityV2 + TransferHook", async () => {
      const blockJSONFile = "increaseLiquidityV2+TransferHook.json"
      const signature = "47KqoYPMmM1A3aC3K6ypZ6xureG92faBUvenGhytub9GncCLTMtZrVozXgsJYembE8mq82JdJPNtxa6VoMMu8TGa";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("increaseLiquidityV2");
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).data.remainingAccountsInfo.length).toEqual(2);
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).data.remainingAccountsInfo[0].accountsType).toEqual(0); // TransferHookA
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).data.remainingAccountsInfo[0].length).toEqual(3);
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).data.remainingAccountsInfo[1].accountsType).toEqual(1); // TransferHookB
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).data.remainingAccountsInfo[1].length).toEqual(3);
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).remainingAccounts.length).toEqual(6);
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).transfers.length).toEqual(2);
      // TransferFeeConfig extension is not initialized
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).transfers[0].transferFeeConfig).toBeNull();
      expect((ixs[0] as DecodedIncreaseLiquidityV2Instruction).transfers[1].transferFeeConfig).toBeNull();
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("decreaseLiquidityV2", () => {
    it("decreaseLiquidityV2 + TransferFee", async () => {
      const blockJSONFile = "decreaseLiquidityV2+TransferFee.json"
      const signature = "63xRFBPLXTtrryj54vHbFwS1Rc3fNfH3hX564PVtsQrVWmLkinSXLAeVqsCNeScU5KB7jG9w4NbRjkTKCsS1V9kn";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("decreaseLiquidityV2");
      expect((ixs[0] as DecodedDecreaseLiquidityV2Instruction).data.remainingAccountsInfo.length).toEqual(0);
      expect((ixs[0] as DecodedDecreaseLiquidityV2Instruction).remainingAccounts.length).toEqual(0);
      expect((ixs[0] as DecodedDecreaseLiquidityV2Instruction).transfers.length).toEqual(2);
      expect((ixs[0] as DecodedDecreaseLiquidityV2Instruction).transfers[0].transferFeeConfig.basisPoints).toEqual(500);
      expect((ixs[0] as DecodedDecreaseLiquidityV2Instruction).transfers[0].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      expect((ixs[0] as DecodedDecreaseLiquidityV2Instruction).transfers[1].transferFeeConfig.basisPoints).toEqual(1000);
      expect((ixs[0] as DecodedDecreaseLiquidityV2Instruction).transfers[1].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("swapV2", () => {
    it("swapV2 + TransferFee", async () => {
      const blockJSONFile = "swapV2+TransferFee.json"
      const signature = "3FwvrbW6Q5ZU9DK5Yy7EKfYX454YFFSWQMvYqVSMGQqpsQr6jfVMNXsP9vmnENFzn6SGkcNocyPVYYW89Jb8kwHi";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("swapV2");
      expect((ixs[0] as DecodedSwapV2Instruction).data.remainingAccountsInfo.length).toEqual(0);
      expect((ixs[0] as DecodedSwapV2Instruction).remainingAccounts.length).toEqual(0);
      expect((ixs[0] as DecodedSwapV2Instruction).transfers.length).toEqual(2);
      expect((ixs[0] as DecodedSwapV2Instruction).transfers[0].transferFeeConfig.basisPoints).toEqual(500);
      expect((ixs[0] as DecodedSwapV2Instruction).transfers[0].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      expect((ixs[0] as DecodedSwapV2Instruction).transfers[1].transferFeeConfig.basisPoints).toEqual(1000);
      expect((ixs[0] as DecodedSwapV2Instruction).transfers[1].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      //console.log(JSON.stringify(ixs, null, 2));
    });

    it("swapV2 + TransferHook", async () => {
      const blockJSONFile = "swapV2+TransferHook.json"
      const signature = "64LhMbGhPDdvdhqGUwYGr16Tehfbsrs7Q4fDWhywQAxS8fDVtkRWu23QAwcNpHnGvYZr4WXsAiFiYEBz2EAVyPmT";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("swapV2");
      expect((ixs[0] as DecodedSwapV2Instruction).data.remainingAccountsInfo.length).toEqual(2);
      expect((ixs[0] as DecodedSwapV2Instruction).data.remainingAccountsInfo[0].accountsType).toEqual(0); // TransferHookA
      expect((ixs[0] as DecodedSwapV2Instruction).data.remainingAccountsInfo[0].length).toEqual(3);
      expect((ixs[0] as DecodedSwapV2Instruction).data.remainingAccountsInfo[1].accountsType).toEqual(1); // TransferHookB
      expect((ixs[0] as DecodedSwapV2Instruction).data.remainingAccountsInfo[1].length).toEqual(3);
      expect((ixs[0] as DecodedSwapV2Instruction).remainingAccounts.length).toEqual(6);
      expect((ixs[0] as DecodedSwapV2Instruction).transfers.length).toEqual(2);
      // TransferFeeConfig extension is not initialized
      expect((ixs[0] as DecodedSwapV2Instruction).transfers[0].transferFeeConfig).toBeNull();
      expect((ixs[0] as DecodedSwapV2Instruction).transfers[1].transferFeeConfig).toBeNull();
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("twoHopSwapV2", () => {
    it("twoHopSwapV2 + TransferFee", async () => {
      const blockJSONFile = "twoHopSwapV2+TransferFee.json"
      const signature = "36Z5EJhmaUDqz3UK7szYYAJPRjyouGBPqEGpTLdEqawiUTtNFZjmxQtNGzb7sYpY48kTheGk5MgzLXbHL9qoo3r";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("twoHopSwapV2");
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo.length).toEqual(0);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).remainingAccounts.length).toEqual(0);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers.length).toEqual(3);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers[0].transferFeeConfig.basisPoints).toEqual(300);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers[0].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers[1].transferFeeConfig.basisPoints).toEqual(500);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers[1].transferFeeConfig.maximumFee).toEqual(18446744073709551615n);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers[2].transferFeeConfig.basisPoints).toEqual(1000);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers[2].transferFeeConfig.maximumFee).toEqual(1000000000n);
      //console.log(JSON.stringify(ixs, null, 2));
    });

    it("twoHopSwapV2 + TransferHook", async () => {
      const blockJSONFile = "twoHopSwapV2+TransferHook.json"
      const signature = "HKe8XRZqDHnwaYihbZKcutJMzqjHpU3VPUg8joq3G9aFt9HG3DsUCVJdDKF36Nx4mymrX19xSr92nY3FkgWQSE4";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("twoHopSwapV2");
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo.length).toEqual(3);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo[0].accountsType).toEqual(3); // TransferHookInput
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo[0].length).toEqual(3);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo[1].accountsType).toEqual(4); // TransferHookIntermediate
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo[1].length).toEqual(3);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo[2].accountsType).toEqual(5); // TransferHookOutput
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).data.remainingAccountsInfo[2].length).toEqual(3);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).remainingAccounts.length).toEqual(9);
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers.length).toEqual(3);
      // TransferFeeConfig extension is not initialized
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers[0].transferFeeConfig).toBeNull();
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers[1].transferFeeConfig).toBeNull();
      expect((ixs[0] as DecodedTwoHopSwapV2Instruction).transfers[1].transferFeeConfig).toBeNull();
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("initializePoolV2", () => {
    it("initializePoolV2", async () => {
      const blockJSONFile = "initializePoolV2.json"
      const signature = "3XK5aTGvFBS4dqa13WRuBaDuzWptUYNojiLjRSm6BCRoZdEZBV3WyPsuweKCPF4mP4TmVgMf18C8E7Z1f2rimHGP";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("initializePoolV2");
      expect((ixs[0] as DecodedInitializePoolV2Instruction).decimals.tokenMintA).toEqual(0);
      expect((ixs[0] as DecodedInitializePoolV2Instruction).decimals.tokenMintB).toEqual(0);
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("initializeRewardV2", () => {
    it("initializeRewardV2", async () => {
      const blockJSONFile = "initializeRewardV2.json"
      const signature = "2FPoRBnMGYTqDN7YELpTBUmQ1JkRMQsoUxNNhmGG9smYE4QeCL6MRk5d5WBxE1cmsDk7r1pkFtbCySdD88KCX5Ca";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("initializeRewardV2");
      expect((ixs[0] as DecodedInitializeRewardV2Instruction).decimals.rewardMint).toEqual(0);
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("setRewardEmissionsV2", () => {
    it("setRewardEmissionsV2", async () => {
      const blockJSONFile = "setRewardEmissionsV2.json"
      const signature = "2TvR68TBCJDihauPMgKBhQJsyWggF449jh9j4HroWW2CuWrKhRXvrXhbQEL44LANvhntp9Jzoz7rZdtDfre3Eerw";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("setRewardEmissionsV2");
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("initializeConfigExtension", () => {
    it("initializeConfigExtension", async () => {
      const blockJSONFile = "initializeConfigExtension.json"
      const signature = "59ivA5wN6NL7c5vSg5drj2ckmNc7b82Hw6MwELeApbSn316FVp7WpprtYd7w35NfGSJaghW6kPzLnighbptAtZQf";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("initializeConfigExtension");
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("initializeTokenBadge", () => {
    it("initializeTokenBadge", async () => {
      const blockJSONFile = "initializeTokenBadge.json"
      const signature = "5VV41GheSPG9NfcpZD6DoP8JFXABtATmYqjbT5wJ2P1pnpPSsyPYCigKQAuMDL3RZLRmAykjjkhJBfgy8KLh1RZD";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("initializeTokenBadge");
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("deleteTokenBadge", () => {
    it("deleteTokenBadge", async () => {
      const blockJSONFile = "deleteTokenBadge.json"
      const signature = "5CWDHLYAPSgdnWwwXvNPQrzEbZH1dt14yNriBPpmisqkVaQhT7pnyMTqsLYxRQo2VMjuLLNxvAU6nZCkvM7HCEPy";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("deleteTokenBadge");
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("setConfigExtensionAuthority", () => {
    it("setConfigExtensionAuthority", async () => {
      const blockJSONFile = "setConfigExtensionAuthority.json"
      const signature = "5nWr7oBmpCFKzNVcyJLE5Ldmdv2C8ofKxbHnUR9hHGSu93ewJ5ARUP94MSLJZsT1MQcopnKnhwzSbMZXCRd8mTET";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("setConfigExtensionAuthority");
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

  describe("setTokenBadgeAuthority", () => {
    it("setTokenBadgeAuthority", async () => {
      const blockJSONFile = "setTokenBadgeAuthority.json"
      const signature = "27ProUxonvzaq7S3GVtmhDgsDzGSkNSuuoGo1epfRQwWMEXFgV7HChc9tF6QgpD9CS6qVZLJmhhXyWRTyp8oC7eP";
      const json = getTransactionJSON(blockJSONFile, signature);

      const ixs = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      expect(ixs.length).toEqual(1);
      expect(ixs[0].name).toEqual("setTokenBadgeAuthority");
      //console.log(JSON.stringify(ixs, null, 2));
    });
  });

});