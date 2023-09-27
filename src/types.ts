import { BN } from "@coral-xyz/anchor";

export type PubkeyString = string;
export type TransferAmount = bigint;

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
  programId: PubkeyString;
  accounts: PubkeyString[];
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
    tokenProgram: PubkeyString;
    tokenAuthority: PubkeyString;
    whirlpool: PubkeyString;
    tokenOwnerAccountA: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenOwnerAccountB: PubkeyString;
    tokenVaultB: PubkeyString;
    tickArray0: PubkeyString;
    tickArray1: PubkeyString;
    tickArray2: PubkeyString;
    oracle: PubkeyString;
  };
  transfers: TransferAmount[];
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
    tokenProgram: PubkeyString;
    tokenAuthority: PubkeyString;
    whirlpoolOne: PubkeyString;
    whirlpoolTwo: PubkeyString;
    tokenOwnerAccountOneA: PubkeyString;
    tokenVaultOneA: PubkeyString;
    tokenOwnerAccountOneB: PubkeyString;
    tokenVaultOneB: PubkeyString;
    tokenOwnerAccountTwoA: PubkeyString;
    tokenVaultTwoA: PubkeyString;
    tokenOwnerAccountTwoB: PubkeyString;
    tokenVaultTwoB: PubkeyString;
    tickArrayOne0: PubkeyString;
    tickArrayOne1: PubkeyString;
    tickArrayOne2: PubkeyString;
    tickArrayTwo0: PubkeyString;
    tickArrayTwo1: PubkeyString;
    tickArrayTwo2: PubkeyString;
    oracleOne: PubkeyString;
    oracleTwo: PubkeyString;
  };
  transfers: TransferAmount[];
};

export type DecodedOpenPositionInstruction = {
  name: "openPosition";
  data: {
    tickLowerIndex: number;
    tickUpperIndex: number;
  };
  accounts: {
    funder: PubkeyString;
    owner: PubkeyString;
    position: PubkeyString;
    positionMint: PubkeyString;
    positionTokenAccount: PubkeyString;
    whirlpool: PubkeyString;
    tokenProgram: PubkeyString;
    systemProgram: PubkeyString;
    rent: PubkeyString;
    associatedTokenProgram: PubkeyString;
  };
};

export type DecodedOpenPositionWithMetadataInstruction = {
  name: "openPositionWithMetadata";
  data: {
    tickLowerIndex: number;
    tickUpperIndex: number;
  };
  accounts: {
    funder: PubkeyString;
    owner: PubkeyString;
    position: PubkeyString;
    positionMint: PubkeyString;
    positionMetadataAccount: PubkeyString;
    positionTokenAccount: PubkeyString;
    whirlpool: PubkeyString;
    tokenProgram: PubkeyString;
    systemProgram: PubkeyString;
    rent: PubkeyString;
    associatedTokenProgram: PubkeyString;
    metadataProgram: PubkeyString;
    metadataUpdateAuth: PubkeyString;
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
    whirlpool: PubkeyString;
    tokenProgram: PubkeyString;
    positionAuthority: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    tokenOwnerAccountA: PubkeyString;
    tokenOwnerAccountB: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    tickArrayLower: PubkeyString;
    tickArrayUpper: PubkeyString;
  };
  transfers: TransferAmount[];
};

export type DecodedDecreaseLiquidityInstruction = {
  name: "decreaseLiquidity";
  data: {
    liquidityAmount: BN;
    tokenMinA: BN;
    tokenMinB: BN;
  };
  accounts: {
    whirlpool: PubkeyString;
    tokenProgram: PubkeyString;
    positionAuthority: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    tokenOwnerAccountA: PubkeyString;
    tokenOwnerAccountB: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    tickArrayLower: PubkeyString;
    tickArrayUpper: PubkeyString;
  };
  transfers: TransferAmount[];
};

export type DecodedUpdateFeesAndRewardsInstruction = {
  name: "updateFeesAndRewards";
  data: {};
  accounts: {
    whirlpool: PubkeyString;
    position: PubkeyString;
    tickArrayLower: PubkeyString;
    tickArrayUpper: PubkeyString;
  };
};

export type DecodedCollectFeesInstruction = {
  name: "collectFees";
  data: {};
  accounts: {
    whirlpool: PubkeyString;
    positionAuthority: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    tokenOwnerAccountA: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenOwnerAccountB: PubkeyString;
    tokenVaultB: PubkeyString;
    tokenProgram: PubkeyString;
  };
  transfers: TransferAmount[];
};

export type DecodedCollectRewardInstruction = {
  name: "collectReward";
  data: {
    rewardIndex: number;
  };
  accounts: {
    whirlpool: PubkeyString;
    positionAuthority: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    rewardOwnerAccount: PubkeyString;
    rewardVault: PubkeyString;
    tokenProgram: PubkeyString;
  };
  transfers: TransferAmount[];
};

export type DecodedClosePositionInstruction = {
  name: "closePosition";
  data: {};
  accounts: {
    positionAuthority: PubkeyString;
    receiver: PubkeyString;
    position: PubkeyString;
    positionMint: PubkeyString;
    positionTokenAccount: PubkeyString;
    tokenProgram: PubkeyString;
  };
};

export type DecodedCollectProtocolFeesInstruction = {
  name: "collectProtocolFees";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpool: PubkeyString;
    collectProtocolFeesAuthority: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    tokenDestinationA: PubkeyString;
    tokenDestinationB: PubkeyString;
    tokenProgram: PubkeyString;
  };
  transfers: TransferAmount[];
};

export type DecodedAdminIncreaseLiquidityInstruction = {
  name: "adminIncreaseLiquidity";
  data: {
    liquidity: BN;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpool: PubkeyString;
    authority: PubkeyString;
  };
};

export type DecodedInitializeConfigInstruction = {
  name: "initializeConfig";
  data: {
    feeAuthority: PubkeyString;
    collectProtocolFeesAuthority: PubkeyString;
    rewardEmissionsSuperAuthority: PubkeyString;
    defaultProtocolFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    funder: PubkeyString;
    systemProgram: PubkeyString;
  };
};

export type DecodedInitializeFeeTierInstruction = {
  name: "initializeFeeTier";
  data: {
    tickSpacing: number;
    defaultFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    feeTier: PubkeyString;
    funder: PubkeyString;
    feeAuthority: PubkeyString;
    systemProgram: PubkeyString;
  };
};

export type DecodedInitializePoolInstruction = {
  name: "initializePool";
  data: {
    tickSpacing: number;
    initialSqrtPrice: BN;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    tokenMintA: PubkeyString;
    tokenMintB: PubkeyString;
    funder: PubkeyString;
    whirlpool: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    feeTier: PubkeyString;
    tokenProgram: PubkeyString;
    systemProgram: PubkeyString;
    rent: PubkeyString;
  };
};

export type DecodedInitializePositionBundleInstruction = {
  name: "initializePositionBundle";
  data: {};
  accounts: {
    positionBundle: PubkeyString;
    positionBundleMint: PubkeyString;
    positionBundleTokenAccount: PubkeyString;
    positionBundleOwner: PubkeyString;
    funder: PubkeyString;
    tokenProgram: PubkeyString;
    systemProgram: PubkeyString;
    rent: PubkeyString;
    associatedTokenProgram: PubkeyString;
  };
};

export type DecodedInitializePositionBundleWithMetadataInstruction = {
  name: "initializePositionBundleWithMetadata";
  data: {};
  accounts: {
    positionBundle: PubkeyString;
    positionBundleMint: PubkeyString;
    positionBundleMetadata: PubkeyString;
    positionBundleTokenAccount: PubkeyString;
    positionBundleOwner: PubkeyString;
    funder: PubkeyString;
    metadataUpdateAuth: PubkeyString;
    tokenProgram: PubkeyString;
    systemProgram: PubkeyString;
    rent: PubkeyString;
    associatedTokenProgram: PubkeyString;
    metadataProgram: PubkeyString;
  };
};

export type DecodedInitializeRewardInstruction = {
  name: "initializeReward";
  data: {
    rewardIndex: number;
  };
  accounts: {
    rewardAuthority: PubkeyString;
    funder: PubkeyString;
    whirlpool: PubkeyString;
    rewardMint: PubkeyString;
    rewardVault: PubkeyString;
    tokenProgram: PubkeyString;
    systemProgram: PubkeyString;
    rent: PubkeyString;
  };
};

export type DecodedInitializeTickArrayInstruction = {
  name: "initializeTickArray";
  data: {
    startTickIndex: number;
  };
  accounts: {
    whirlpool: PubkeyString;
    funder: PubkeyString;
    tickArray: PubkeyString;
    systemProgram: PubkeyString;
  };
};

export type DecodedDeletePositionBundleInstruction = {
  name: "deletePositionBundle";
  data: {};
  accounts: {
    positionBundle: PubkeyString;
    positionBundleMint: PubkeyString;
    positionBundleTokenAccount: PubkeyString;
    positionBundleOwner: PubkeyString;
    receiver: PubkeyString;
    tokenProgram: PubkeyString;
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
    bundledPosition: PubkeyString;
    positionBundle: PubkeyString;
    positionBundleTokenAccount: PubkeyString;
    positionBundleAuthority: PubkeyString;
    whirlpool: PubkeyString;
    funder: PubkeyString;
    systemProgram: PubkeyString;
    rent: PubkeyString;
  };
};

export type DecodedCloseBundledPositionInstruction = {
  name: "closeBundledPosition";
  data: {
    bundleIndex: number;
  };
  accounts: {
    bundledPosition: PubkeyString;
    positionBundle: PubkeyString;
    positionBundleTokenAccount: PubkeyString;
    positionBundleAuthority: PubkeyString;
    receiver: PubkeyString;
  };
};

export type DecodedSetCollectProtocolFeesAuthorityInstruction = {
  name: "setCollectProtocolFeesAuthority";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    collectProtocolFeesAuthority: PubkeyString;
    newCollectProtocolFeesAuthority: PubkeyString;
  };
};

export type DecodedSetDefaultFeeRateInstruction = {
  name: "setDefaultFeeRate";
  data: {
    defaultFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    feeTier: PubkeyString;
    feeAuthority: PubkeyString;
  };
};

export type DecodedSetDefaultProtocolFeeRateInstruction = {
  name: "setDefaultProtocolFeeRate";
  data: {
    defaultProtocolFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    feeAuthority: PubkeyString;
  };
};

export type DecodedSetFeeAuthorityInstruction = {
  name: "setFeeAuthority";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    feeAuthority: PubkeyString;
    newFeeAuthority: PubkeyString;
  };
};

export type DecodedSetFeeRateInstruction = {
  name: "setFeeRate";
  data: {
    feeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpool: PubkeyString;
    feeAuthority: PubkeyString;
  };
};

export type DecodedSetProtocolFeeRateInstruction = {
  name: "setProtocolFeeRate";
  data: {
    protocolFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpool: PubkeyString;
    feeAuthority: PubkeyString;
  };
};

export type DecodedSetRewardAuthorityInstruction = {
  name: "setRewardAuthority";
  data: {
    rewardIndex: number;
  };
  accounts: {
    whirlpool: PubkeyString;
    rewardAuthority: PubkeyString;
    newRewardAuthority: PubkeyString;
  };
};

export type DecodedSetRewardAuthorityBySuperAuthorityInstruction = {
  name: "setRewardAuthorityBySuperAuthority";
  data: {
    rewardIndex: number;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpool: PubkeyString;
    rewardEmissionsSuperAuthority: PubkeyString;
    newRewardAuthority: PubkeyString;
  };
};

export type DecodedSetRewardEmissionsInstruction = {
  name: "setRewardEmissions";
  data: {
    rewardIndex: number;
    emissionsPerSecondX64: BN;
  };
  accounts: {
    whirlpool: PubkeyString;
    rewardAuthority: PubkeyString;
    rewardVault: PubkeyString;
  };
};

export type DecodedSetRewardEmissionsSuperAuthorityInstruction = {
  name: "setRewardEmissionsSuperAuthority";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    rewardEmissionsSuperAuthority: PubkeyString;
    newRewardEmissionsSuperAuthority: PubkeyString;
  };
};
