import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { DecodedTransferInstruction } from "@solana/spl-token";

export type InstructionJSON = {
  programIdIndex: number;
  accounts: number[];
  data: string;
};

export type InnerInstructionJSON = {
  index: number;
  instructions: InstructionJSON[];
};

export type TransactionJSON = {
  result: {
    meta: {
      innerInstructions: InnerInstructionJSON[];
      // V0 only
      loadedAddresses?: {
        writable: string[];
        readonly: string[];
      };
    };
    transaction: {
      message: {
        accountKeys: string[];
        instructions: InstructionJSON[];
      };
    };
  };
};

export type Instruction = {
  programId: PublicKey;
  accounts: PublicKey[];
  dataBase58: string;
};

export type DecodedWhirlpoolInstruction =
  DecodedSwapInstruction |
  DecodedTwoHopSwapInstruction |
  DecodedOpenPositionInstruction |
  DecodedOpenPositionWithMetadataInstruction |
  DecodedIncreaseLiquidityInstruction |
  DecodedDecreaseLiquidityInstruction |
  DecodedUpdateFeesAndRewardsInstruction |
  DecodedCollectFeesInstruction |
  DecodedCollectRewardInstruction |
  DecodedClosePositionInstruction |
  DecodedCollectProtocolFeesInstruction |
  DecodedInitializeConfigInstruction |
  DecodedInitializeFeeTierInstruction |
  DecodedInitializePoolInstruction |
  DecodedInitializePositionBundleInstruction |
  DecodedInitializePositionBundleWithMetadataInstruction |
  DecodedInitializeRewardInstruction |
  DecodedInitializeTickArrayInstruction |
  DecodedDeletePositionBundleInstruction |
  DecodedOpenBundledPositionInstruction |
  DecodedCloseBundledPositionInstruction |
  DecodedSetCollectProtocolFeesAuthorityInstruction |
  DecodedSetDefaultFeeRateInstruction |
  DecodedSetDefaultProtocolFeeRateInstruction |
  DecodedSetFeeAuthorityInstruction |
  DecodedSetFeeRateInstruction |
  DecodedSetProtocolFeeRateInstruction |
  DecodedSetRewardAuthorityInstruction |
  DecodedSetRewardAuthorityBySuperAuthorityInstruction |
  DecodedSetRewardEmissionsInstruction |
  DecodedSetRewardEmissionsSuperAuthorityInstruction |
  DecodedAdminIncreaseLiquidityInstruction;

export type DecodedSwapInstruction = {
  name: "swap";
  data: {
    amount: BN;
    otherAmountThreshold: BN;
    sqrtPriceLimit: BN;
    amountSpecifiedIsInput: boolean;
    aToB: boolean;
  };
  accounts: {
    tokenProgram: PublicKey;
    tokenAuthority: PublicKey;
    whirlpool: PublicKey;
    tokenOwnerAccountA: PublicKey;
    tokenVaultA: PublicKey;
    tokenOwnerAccountB: PublicKey;
    tokenVaultB: PublicKey;
    tickArray0: PublicKey;
    tickArray1: PublicKey;
    tickArray2: PublicKey;
    oracle: PublicKey;
  };
  transfers: DecodedTransferInstruction[];
};

export type DecodedTwoHopSwapInstruction = {
  name: "twoHopSwap";
  data: {
    amount: BN;
    otherAmountThreshold: BN;
    amountSpecifiedIsInput: boolean;
    aToBOne: boolean;
    aToBTwo: boolean;
    sqrtPriceLimitOne: BN;
    sqrtPriceLimitTwo: BN;
  };
  accounts: {
    tokenProgram: PublicKey;
    tokenAuthority: PublicKey;
    whirlpoolOne: PublicKey;
    whirlpoolTwo: PublicKey;
    tokenOwnerAccountOneA: PublicKey;
    tokenVaultOneA: PublicKey;
    tokenOwnerAccountOneB: PublicKey;
    tokenVaultOneB: PublicKey;
    tokenOwnerAccountTwoA: PublicKey;
    tokenVaultTwoA: PublicKey;
    tokenOwnerAccountTwoB: PublicKey;
    tokenVaultTwoB: PublicKey;
    tickArrayOne0: PublicKey;
    tickArrayOne1: PublicKey;
    tickArrayOne2: PublicKey;
    tickArrayTwo0: PublicKey;
    tickArrayTwo1: PublicKey;
    tickArrayTwo2: PublicKey;
    oracleOne: PublicKey;
    oracleTwo: PublicKey;
  };
  transfers: DecodedTransferInstruction[];
};

export type DecodedOpenPositionInstruction = {
  name: "openPosition";
  data: {
    tickLowerIndex: number;
    tickUpperIndex: number;
  };
  accounts: {
    funder: PublicKey;
    owner: PublicKey;
    position: PublicKey;
    positionMint: PublicKey;
    positionTokenAccount: PublicKey;
    whirlpool: PublicKey;
    tokenProgram: PublicKey;
    systemProgram: PublicKey;
    rent: PublicKey;
    associatedTokenProgram: PublicKey;
  };
};

export type DecodedOpenPositionWithMetadataInstruction = {
  name: "openPositionWithMetadata";
  data: {
    tickLowerIndex: number;
    tickUpperIndex: number;
  };
  accounts: {
    funder: PublicKey;
    owner: PublicKey;
    position: PublicKey;
    positionMint: PublicKey;
    positionMetadataAccount: PublicKey;
    positionTokenAccount: PublicKey;
    whirlpool: PublicKey;
    tokenProgram: PublicKey;
    systemProgram: PublicKey;
    rent: PublicKey;
    associatedTokenProgram: PublicKey;
  };
};

export type DecodedIncreaseLiquidityInstruction = {
  name: "increaseLiquidity";
  data: {
    liquidityAmount: BN;
    tokenMaxA: BN;
    tokenMaxB: BN;
  };
  accounts: {
    whirlpool: PublicKey;
    tokenProgram: PublicKey;
    positionAuthority: PublicKey;
    position: PublicKey;
    positionTokenAccount: PublicKey;
    tokenOwnerAccountA: PublicKey;
    tokenOwnerAccountB: PublicKey;
    tokenVaultA: PublicKey;
    tokenVaultB: PublicKey;
    tickArrayLower: PublicKey;
    tickArrayUpper: PublicKey;
  };
  transfers: DecodedTransferInstruction[];
};

export type DecodedDecreaseLiquidityInstruction = {
  name: "decreaseLiquidity";
  data: {
    liquidityAmount: BN;
    tokenMinA: BN;
    tokenMinB: BN;
  };
  accounts: {
    whirlpool: PublicKey;
    tokenProgram: PublicKey;
    positionAuthority: PublicKey;
    position: PublicKey;
    positionTokenAccount: PublicKey;
    tokenOwnerAccountA: PublicKey;
    tokenOwnerAccountB: PublicKey;
    tokenVaultA: PublicKey;
    tokenVaultB: PublicKey;
    tickArrayLower: PublicKey;
    tickArrayUpper: PublicKey;
  };
  transfers: DecodedTransferInstruction[];
};

export type DecodedUpdateFeesAndRewardsInstruction = {
  name: "updateFeesAndRewards";
  data: {};
  accounts: {
    whirlpool: PublicKey;
    position: PublicKey;
    tickArrayLower: PublicKey;
    tickArrayUpper: PublicKey;
  };
};

export type DecodedCollectFeesInstruction = {
  name: "collectFees";
  data: {};
  accounts: {
    whirlpool: PublicKey;
    positionAuthority: PublicKey;
    position: PublicKey;
    positionTokenAccount: PublicKey;
    tokenOwnerAccountA: PublicKey;
    tokenVaultA: PublicKey;
    tokenOwnerAccountB: PublicKey;
    tokenVaultB: PublicKey;
    tokenProgram: PublicKey;
  };
  transfers: DecodedTransferInstruction[];
};

export type DecodedCollectRewardInstruction = {
  name: "collectReward";
  data: {
    rewardIndex: number;
  };
  accounts: {
    whirlpool: PublicKey;
    positionAuthority: PublicKey;
    position: PublicKey;
    positionTokenAccount: PublicKey;
    rewardOwnerAccount: PublicKey;
    rewardVault: PublicKey;
    tokenProgram: PublicKey;
  };
  transfers: DecodedTransferInstruction[];
};

export type DecodedClosePositionInstruction = {
  name: "closePosition";
  data: {};
  accounts: {
    positionAuthority: PublicKey;
    receiver: PublicKey;
    position: PublicKey;
    positionMint: PublicKey;
    positionTokenAccount: PublicKey;
    tokenProgram: PublicKey;
  };
};

export type DecodedCollectProtocolFeesInstruction = {
  name: "collectProtocolFees";
  data: {};
  accounts: {
    whirlpoolsConfig: PublicKey;
    whirlpool: PublicKey;
    collectProtocolFeesAuthority: PublicKey;
    tokenVaultA: PublicKey;
    tokenVaultB: PublicKey;
    tokenDestinationA: PublicKey;
    tokenDestinationB: PublicKey;
    tokenProgram: PublicKey;
  };
  transfers: DecodedTransferInstruction[];
};

export type DecodedAdminIncreaseLiquidityInstruction = {
  name: "adminIncreaseLiquidity";
  data: {
    liquidity: BN;
  };
  accounts: {
    whirlpoolsConfig: PublicKey;
    whirlpool: PublicKey;
    authority: PublicKey;
  };
};

export type DecodedInitializeConfigInstruction = {
  name: "initializeConfig";
  data: {
    feeAuthority: PublicKey;
    collectProtocolFeesAuthority: PublicKey;
    rewardEmissionsSuperAuthority: PublicKey;
    defaultProtocolFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PublicKey;
    funder: PublicKey;
    systemProgram: PublicKey;
  };
};

export type DecodedInitializeFeeTierInstruction = {
  name: "initializeFeeTier";
  data: {
    tickSpacing: number;
    defaultFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PublicKey;
    feeTier: PublicKey;
    funder: PublicKey;
    feeAuthority: PublicKey;
    systemProgram: PublicKey;
  };
};

export type DecodedInitializePoolInstruction = {
  name: "initializePool";
  data: {
    tickSpacing: number;
    initialSqrtPrice: BN;
  };
  accounts: {
    whirlpoolsConfig: PublicKey;
    tokenMintA: PublicKey;
    tokenMintB: PublicKey;
    funder: PublicKey;
    whirlpool: PublicKey;
    tokenVaultA: PublicKey;
    tokenVaultB: PublicKey;
    feeTier: PublicKey;
    tokenProgram: PublicKey;
    systemProgram: PublicKey;
    rent: PublicKey;
  };
};

export type DecodedInitializePositionBundleInstruction = {
  name: "initializePositionBundle";
  data: {};
  accounts: {
    positionBundle: PublicKey;
    positionBundleMint: PublicKey;
    positionBundleTokenAccount: PublicKey;
    positionBundleOwner: PublicKey;
    funder: PublicKey;
    tokenProgram: PublicKey;
    systemProgram: PublicKey;
    rent: PublicKey;
    associatedTokenProgram: PublicKey;
  };
};

export type DecodedInitializePositionBundleWithMetadataInstruction = {
  name: "initializePositionBundleWithMetadata";
  data: {};
  accounts: {
    positionBundle: PublicKey;
    positionBundleMint: PublicKey;
    positionBundleMetadata: PublicKey;
    positionBundleTokenAccount: PublicKey;
    positionBundleOwner: PublicKey;
    funder: PublicKey;
    metadataUpdateAuth: PublicKey;
    tokenProgram: PublicKey;
    systemProgram: PublicKey;
    rent: PublicKey;
    associatedTokenProgram: PublicKey;
    metadataProgram: PublicKey;
  };
};

export type DecodedInitializeRewardInstruction = {
  name: "initializeReward";
  data: {
    rewardIndex: number;
  };
  accounts: {
    rewardAuthority: PublicKey;
    funder: PublicKey;
    whirlpool: PublicKey;
    rewardMint: PublicKey;
    rewardVault: PublicKey;
    tokenProgram: PublicKey;
    systemProgram: PublicKey;
    rent: PublicKey;
  };
};

export type DecodedInitializeTickArrayInstruction = {
  name: "initializeTickArray";
  data: {
    startTickIndex: number;
  };
  accounts: {
    whirlpool: PublicKey;
    funder: PublicKey;
    tickArray: PublicKey;
    systemProgram: PublicKey;
  };
};

export type DecodedDeletePositionBundleInstruction = {
  name: "deletePositionBundle";
  data: {};
  accounts: {
    positionBundle: PublicKey;
    positionBundleMint: PublicKey;
    positionBundleTokenAccount: PublicKey;
    positionBundleOwner: PublicKey;
    receiver: PublicKey;
    tokenProgram: PublicKey;
  };
};

export type DecodedOpenBundledPositionInstruction = {
  name: "openBundledPosition";
  data: {
    bundleIndex: number;
    tickLowerIndex: number;
    tickUpperIndex: number;
  };
  accounts: {
    bundledPosition: PublicKey;
    positionBundle: PublicKey;
    positionBundleTokenAccount: PublicKey;
    positionBundleAuthority: PublicKey;
    whirlpool: PublicKey;
    funder: PublicKey;
    systemProgram: PublicKey;
    rent: PublicKey;
  };
};

export type DecodedCloseBundledPositionInstruction = {
  name: "closeBundledPosition";
  data: {
    bundleIndex: number;
  };
  accounts: {
    bundledPosition: PublicKey;
    positionBundle: PublicKey;
    positionBundleTokenAccount: PublicKey;
    positionBundleAuthority: PublicKey;
    receiver: PublicKey;
  };
};

export type DecodedSetCollectProtocolFeesAuthorityInstruction = {
  name: "setCollectProtocolFeesAuthority";
  data: {};
  accounts: {
    whirlpoolsConfig: PublicKey;
    collectProtocolFeesAuthority: PublicKey;
    newCollectProtocolFeesAuthority: PublicKey;
  };
};

export type DecodedSetDefaultFeeRateInstruction = {
  name: "setDefaultFeeRate";
  data: {
    defaultFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PublicKey;
    feeTier: PublicKey;
    feeAuthority: PublicKey;
  };
};

export type DecodedSetDefaultProtocolFeeRateInstruction = {
  name: "setDefaultProtocolFeeRate";
  data: {
    defaultProtocolFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PublicKey;
    feeAuthority: PublicKey;
  };
};

export type DecodedSetFeeAuthorityInstruction = {
  name: "setFeeAuthority";
  data: {};
  accounts: {
    whirlpoolsConfig: PublicKey;
    feeAuthority: PublicKey;
    newFeeAuthority: PublicKey;
  };
};

export type DecodedSetFeeRateInstruction = {
  name: "setFeeRate";
  data: {
    feeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PublicKey;
    whirlpool: PublicKey;
    feeAuthority: PublicKey;
  };
};

export type DecodedSetProtocolFeeRateInstruction = {
  name: "setProtocolFeeRate";
  data: {
    protocolFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PublicKey;
    whirlpool: PublicKey;
    feeAuthority: PublicKey;
  };
};

export type DecodedSetRewardAuthorityInstruction = {
  name: "setRewardAuthority";
  data: {
    rewardIndex: number;
  };
  accounts: {
    whirlpool: PublicKey;
    rewardAuthority: PublicKey;
    newRewardAuthority: PublicKey;
  };
};

export type DecodedSetRewardAuthorityBySuperAuthorityInstruction = {
  name: "setRewardAuthorityBySuperAuthority";
  data: {
    rewardIndex: number;
  };
  accounts: {
    whirlpoolsConfig: PublicKey;
    whirlpool: PublicKey;
    rewardEmissionsSuperAuthority: PublicKey;
    newRewardAuthority: PublicKey;
  };
};

export type DecodedSetRewardEmissionsInstruction = {
  name: "setRewardEmissions";
  data: {
    rewardIndex: number;
    emissionsPerSecondX64: BN;
  };
  accounts: {
    whirlpool: PublicKey;
    rewardAuthority: PublicKey;
    rewardVault: PublicKey;
  };
};

export type DecodedSetRewardEmissionsSuperAuthorityInstruction = {
  name: "setRewardEmissionsSuperAuthority";
  data: {};
  accounts: {
    whirlpoolsConfig: PublicKey;
    rewardEmissionsSuperAuthority: PublicKey;
    newRewardEmissionsSuperAuthority: PublicKey;
  };
};
