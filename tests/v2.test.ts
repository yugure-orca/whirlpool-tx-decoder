import { WhirlpoolTransactionDecoder } from "../src/decoder";
import { TransactionJSON } from "../src/types";

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
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });


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


    it.only("collectFeesV2 + TransferHook (multiple instruction)", async () => {
      const blockJSONFile = "collectFeesV2+TransferHook+multiple.json"
      const signature = "4gPMYUsSKbCZ21Wcv6ht1JHUAp3smxa4BCNBSbJxTjJAUkrzJxj6SJoSPEdLuD3EuTQ9aTW5LJGm82GoXfmcDsNs";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });
  });

  describe("collectProtocolFeesV2", () => {
    it("collectProtocolFeesV2 + TransferFee", async () => {
      const blockJSONFile = "collectProtocolFeesV2+TransferFee.json"
      const signature = "3epC7jG3bnYcudNgMdFG2sawY7oYBqHsDUs9y5uc1zKuZLo2NLZ64YpzGufURTYHHQgEqSUUbZvwHbNsJG9F5wHN";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });
  });

  describe("collectRewardV2", () => {
    it("collectRewardV2 + TransferFee", async () => {
      const blockJSONFile = "collectRewardV2+TransferFee.json"
      const signature = "2k4z3NF5bNcNrNoLnEyv6sSVP1yNbmxVHXhmTwkhM6yaQE5UPKMo3oVnT5jeBTo9nMrqreGUQ6sLrGsesLCdFx22";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });

    it("collectRewardV2 + TransferHook", async () => {
      const blockJSONFile = "collectRewardV2+TransferHook.json"
      const signature = "5fpxz4dkdH4VvtRaWa9MgGEyv1DDJzDHbhkzXUEKJwtkqcgfCdfBQtKzUbrbRKE1deVtUsoVX7xaXvjhDCp1K9qU";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });
  });

  describe("increaseLiquidityV2", () => {
    it("increaseLiquidityV2 + TransferFee", async () => {
      const blockJSONFile = "increaseLiquidityV2+TransferFee.json"
      const signature = "3wSj2iLsx2iL8zEjFohtAagKtyJENHt1e8rEnqgobG29PtNon8zNw48osidP2SUyYwNBjTKqp9gUGDHbA9D8Kb5V";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });

    it("increaseLiquidityV2 + TransferHook", async () => {
      const blockJSONFile = "increaseLiquidityV2+TransferHook.json"
      const signature = "47KqoYPMmM1A3aC3K6ypZ6xureG92faBUvenGhytub9GncCLTMtZrVozXgsJYembE8mq82JdJPNtxa6VoMMu8TGa";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });
  });

  describe("decreaseLiquidityV2", () => {
    it("decreaseLiquidityV2 + TransferFee", async () => {
      const blockJSONFile = "decreaseLiquidityV2+TransferFee.json"
      const signature = "63xRFBPLXTtrryj54vHbFwS1Rc3fNfH3hX564PVtsQrVWmLkinSXLAeVqsCNeScU5KB7jG9w4NbRjkTKCsS1V9kn";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });
  });


  describe("swapV2", () => {
    it("swapV2 + TransferFee", async () => {
      const blockJSONFile = "swapV2+TransferFee.json"
      const signature = "3FwvrbW6Q5ZU9DK5Yy7EKfYX454YFFSWQMvYqVSMGQqpsQr6jfVMNXsP9vmnENFzn6SGkcNocyPVYYW89Jb8kwHi";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });

    it("swapV2 + TransferHook", async () => {
      const blockJSONFile = "swapV2+TransferHook.json"
      const signature = "64LhMbGhPDdvdhqGUwYGr16Tehfbsrs7Q4fDWhywQAxS8fDVtkRWu23QAwcNpHnGvYZr4WXsAiFiYEBz2EAVyPmT";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });
  });

  describe("twoHopSwapV2", () => {
    it("twoHopSwapV2 + TransferFee", async () => {
      const blockJSONFile = "twoHopSwapV2+TransferFee.json"
      const signature = "36Z5EJhmaUDqz3UK7szYYAJPRjyouGBPqEGpTLdEqawiUTtNFZjmxQtNGzb7sYpY48kTheGk5MgzLXbHL9qoo3r";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });

    it("twoHopSwapV2 + TransferHook", async () => {
      const blockJSONFile = "twoHopSwapV2+TransferHook.json"
      const signature = "HKe8XRZqDHnwaYihbZKcutJMzqjHpU3VPUg8joq3G9aFt9HG3DsUCVJdDKF36Nx4mymrX19xSr92nY3FkgWQSE4";

      const json = getTransactionJSON(blockJSONFile, signature);
      const x = WhirlpoolTransactionDecoder.decode(json, WHIRLPOOL_PROGRAM_ID);
      console.log(JSON.stringify(x, null, 2));
    });
  });

});