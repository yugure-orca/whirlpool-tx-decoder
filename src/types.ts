import { BN } from "@coral-xyz/anchor";

export type PubkeyString = string;
export type TransferAmount = bigint;
export type TransferFeeConfig = {
  basisPoints: number;
  maximumFee: bigint;
};
export type TransferAmountWithTransferFeeConfig = {
  amount: TransferAmount;
  // null if TransferFeeConfig exteension is not initialized
  transferFeeConfig: TransferFeeConfig | null;
};
export type TransferAmountWithTransferFeeConfigAndAccounts = TransferAmountWithTransferFeeConfig & {
  source: PubkeyString;
  destination: PubkeyString;
};

// RemainingAccounts
export enum RemainingAccountsType {
  TransferHookA,
  TransferHookB,
  TransferHookReward,
  TransferHookInput,
  TransferHookIntermediate,
  TransferHookOutput,
  SupplementalTickArrays,
  SupplementalTickArraysOne,
  SupplementalTickArraysTwo,
  TransferHookDepositA,
  TransferHookDepositB,
  TransferHookWithdrawalA,
  TransferHookWithdrawalB,
}
export type RemainingAccountsSlice = {
  accountsType: RemainingAccountsType;
  length: number;
}
export type RemainingAccountsInfo = RemainingAccountsSlice[];
export type RemainingAccounts = PubkeyString[];

export type LockType = LockTypePermanent;
export type LockTypePermanent = {
  name: "permanent";
};

export type ConfigFeatureFlag = ConfigFeatureFlagTokenBadge;
export type ConfigFeatureFlagTokenBadge = {
  name: "tokenBadge";
  // fields value
  enabled: boolean;
};

export type TokenBadgeAttribute = TokenBadgeAttributeRequireNonTransferablePosition;
export type TokenBadgeAttributeRequireNonTransferablePosition = {
  name: "requireNonTransferablePosition";
  // fields value
  required: boolean;
};

export type RepositionLiquidityMethod = RepositionLiquidityMethodByLiquidity;
export type RepositionLiquidityMethodByLiquidity = {
  name: "byLiquidity";
  // fields value
  newLiquidityAmount: BN;
  existingRangeTokenMinA: BN;
  existingRangeTokenMinB: BN;
  newRangeTokenMaxA: BN;
  newRangeTokenMaxB: BN;
};

export type IncreaseLiquidityMethod = IncreaseLiquidityMethodByTokenAmounts;
export type IncreaseLiquidityMethodByTokenAmounts = {
  name: "byTokenAmounts";
  // fields value
  tokenMaxA: BN;
  tokenMaxB: BN;
  minSqrtPrice: BN;
  maxSqrtPrice: BN;
};

export type InstructionJSON = {
  // null if block is too old (including inner instructions)
  // null if instruction is top level
  stackHeight: number | null;
  programIdIndex: number;
  accounts: number[];
  data: string;
};

export type InnerInstructionJSON = {
  index: number;
  instructions: InstructionJSON[];
};

export type TokenBalanceJSON = {
  accountIndex: number;
  mint: string;
  owner: string;
  programId: string;
  uiTokenAmount: {
    amount: string;
    decimals: number;
  };
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
      postTokenBalances: TokenBalanceJSON[];
    };
    transaction: {
      message: {
        accountKeys: string[];
        instructions: InstructionJSON[];
      };
      signatures: string[];
    };
  };
};

export type DecimalsMap = Record<PubkeyString, number>;

export type TokenAccountOwnerMap = Record<PubkeyString, PubkeyString>;

export type Instruction = {
  stackHeight: number | null;
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
  DecodedCollectFeesV2Instruction |
  DecodedCollectProtocolFeesV2Instruction |
  DecodedCollectRewardV2Instruction |
  DecodedDecreaseLiquidityV2Instruction |
  DecodedIncreaseLiquidityV2Instruction |
  DecodedInitializePoolV2Instruction |
  DecodedInitializeRewardV2Instruction |
  DecodedSetRewardEmissionsV2Instruction |
  DecodedSwapV2Instruction |
  DecodedTwoHopSwapV2Instruction |
  DecodedInitializeConfigExtensionInstruction |
  DecodedInitializeTokenBadgeInstruction |
  DecodedDeleteTokenBadgeInstruction |
  DecodedSetConfigExtensionAuthorityInstruction |
  DecodedSetTokenBadgeAuthorityInstruction |
  DecodedOpenPositionWithTokenExtensionsInstruction |
  DecodedClosePositionWithTokenExtensionsInstruction |
  DecodedLockPositionInstruction |
  DecodedResetPositionRangeInstruction |
  DecodedTransferLockedPositionInstruction |
  DecodedInitializeAdaptiveFeeTierInstruction |
  DecodedInitializePoolWithAdaptiveFeeInstruction |
  DecodedSetDefaultBaseFeeRateInstruction |
  DecodedSetDelegatedFeeAuthorityInstruction |
  DecodedSetInitializePoolAuthorityInstruction |
  DecodedSetPresetAdaptiveFeeConstantsInstruction |
  DecodedSetFeeRateByDelegatedFeeAuthorityInstruction |
  DecodedInitializeDynamicTickArrayInstruction |
  DecodedSetConfigFeatureFlagInstruction |
  DecodedSetTokenBadgeAttributeInstruction |
  DecodedAdminIncreaseLiquidityInstruction |
  DecodedMigrateRepurposeRewardAuthoritySpaceInstruction |
  DecodedSetAdaptiveFeeConstantsInstruction |
  DecodedRepositionLiquidityV2Instruction |
  DecodedIncreaseLiquidityByTokenAmountsV2Instruction;

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
  decimals: {
    tokenMintA: number;
    tokenMintB: number;
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
  decimals: {
    rewardMint: number;
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

export type DecodedCollectFeesV2Instruction = {
  name: "collectFeesV2";
  data: {
    remainingAccountsInfo: RemainingAccountsInfo;
  };
  accounts: {
    whirlpool: PubkeyString;
    positionAuthority: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    tokenMintA: PubkeyString;
    tokenMintB: PubkeyString;
    tokenOwnerAccountA: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenOwnerAccountB: PubkeyString;
    tokenVaultB: PubkeyString;
    tokenProgramA: PubkeyString;
    tokenProgramB: PubkeyString;
    memoProgram: PubkeyString;
  };
  remainingAccounts: RemainingAccounts;
  transfers: TransferAmountWithTransferFeeConfig[];
};

export type DecodedCollectProtocolFeesV2Instruction = {
  name: "collectProtocolFeesV2";
  data: {
    remainingAccountsInfo: RemainingAccountsInfo;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpool: PubkeyString;
    collectProtocolFeesAuthority: PubkeyString;
    tokenMintA: PubkeyString;
    tokenMintB: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    tokenDestinationA: PubkeyString;
    tokenDestinationB: PubkeyString;
    tokenProgramA: PubkeyString;
    tokenProgramB: PubkeyString;
    memoProgram: PubkeyString;
  };
  remainingAccounts: RemainingAccounts;
  transfers: TransferAmountWithTransferFeeConfig[];
};

export type DecodedCollectRewardV2Instruction = {
  name: "collectRewardV2";
  data: {
    rewardIndex: number;
    remainingAccountsInfo: RemainingAccountsInfo;
  };
  accounts: {
    whirlpool: PubkeyString;
    positionAuthority: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    rewardOwnerAccount: PubkeyString;
    rewardMint: PubkeyString;
    rewardVault: PubkeyString;
    rewardTokenProgram: PubkeyString;
    memoProgram: PubkeyString;
  };
  remainingAccounts: RemainingAccounts;
  transfers: TransferAmountWithTransferFeeConfig[];
};

export type DecodedDecreaseLiquidityV2Instruction = {
  name: "decreaseLiquidityV2";
  data: {
    liquidityAmount: BN;
    tokenMinA: BN;
    tokenMinB: BN;
    remainingAccountsInfo: RemainingAccountsInfo;
  };
  accounts: {
    whirlpool: PubkeyString;
    tokenProgramA: PubkeyString;
    tokenProgramB: PubkeyString;
    memoProgram: PubkeyString;
    positionAuthority: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    tokenMintA: PubkeyString;
    tokenMintB: PubkeyString;
    tokenOwnerAccountA: PubkeyString;
    tokenOwnerAccountB: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    tickArrayLower: PubkeyString;
    tickArrayUpper: PubkeyString;
  };
  remainingAccounts: RemainingAccounts;
  transfers: TransferAmountWithTransferFeeConfig[];
};

export type DecodedIncreaseLiquidityV2Instruction = {
  name: "increaseLiquidityV2";
  data: {
    liquidityAmount: BN;
    tokenMaxA: BN;
    tokenMaxB: BN;
    remainingAccountsInfo: RemainingAccountsInfo;
  };
  accounts: {
    whirlpool: PubkeyString;
    tokenProgramA: PubkeyString;
    tokenProgramB: PubkeyString;
    memoProgram: PubkeyString;
    positionAuthority: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    tokenMintA: PubkeyString;
    tokenMintB: PubkeyString;
    tokenOwnerAccountA: PubkeyString;
    tokenOwnerAccountB: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    tickArrayLower: PubkeyString;
    tickArrayUpper: PubkeyString;
  };
  remainingAccounts: RemainingAccounts;
  transfers: TransferAmountWithTransferFeeConfig[];
};

export type DecodedInitializePoolV2Instruction = {
  name: "initializePoolV2";
  data: {
    tickSpacing: number;
    initialSqrtPrice: BN;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    tokenMintA: PubkeyString;
    tokenMintB: PubkeyString;
    tokenBadgeA: PubkeyString;
    tokenBadgeB: PubkeyString;
    funder: PubkeyString;
    whirlpool: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    feeTier: PubkeyString;
    tokenProgramA: PubkeyString;
    tokenProgramB: PubkeyString;
    systemProgram: PubkeyString;
    rent: PubkeyString;
  };
  decimals: {
    tokenMintA: number;
    tokenMintB: number;
  };
};

export type DecodedInitializeRewardV2Instruction = {
  name: "initializeRewardV2";
  data: {
    rewardIndex: number;
  };
  accounts: {
    rewardAuthority: PubkeyString;
    funder: PubkeyString;
    whirlpool: PubkeyString;
    rewardMint: PubkeyString;
    rewardTokenBadge: PubkeyString;
    rewardVault: PubkeyString;
    rewardTokenProgram: PubkeyString;
    systemProgram: PubkeyString;
    rent: PubkeyString;
  };
  decimals: {
    rewardMint: number;
  };
};

export type DecodedSetRewardEmissionsV2Instruction = {
  name: "setRewardEmissionsV2";
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

export type DecodedSwapV2Instruction = {
  name: "swapV2";
  data: {
    amount: BN;
    otherAmountThreshold: BN;
    sqrtPriceLimit: BN;
    amountSpecifiedIsInput: boolean;
    aToB: boolean;
    remainingAccountsInfo: RemainingAccountsInfo;
  };
  accounts: {
    tokenProgramA: PubkeyString;
    tokenProgramB: PubkeyString;
    memoProgram: PubkeyString;
    tokenAuthority: PubkeyString;
    whirlpool: PubkeyString;
    tokenMintA: PubkeyString;
    tokenMintB: PubkeyString;
    tokenOwnerAccountA: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenOwnerAccountB: PubkeyString;
    tokenVaultB: PubkeyString;
    tickArray0: PubkeyString;
    tickArray1: PubkeyString;
    tickArray2: PubkeyString;
    oracle: PubkeyString;
  };
  remainingAccounts: RemainingAccounts;
  transfers: TransferAmountWithTransferFeeConfig[];
};

export type DecodedTwoHopSwapV2Instruction = {
  name: "twoHopSwapV2";
  data: {
    amount: BN;
    otherAmountThreshold: BN;
    amountSpecifiedIsInput: boolean;
    aToBOne: boolean;
    aToBTwo: boolean;
    sqrtPriceLimitOne: BN;
    sqrtPriceLimitTwo: BN;
    remainingAccountsInfo: RemainingAccountsInfo;
  };
  accounts: {
    whirlpoolOne: PubkeyString;
    whirlpoolTwo: PubkeyString;
    tokenMintInput: PubkeyString;
    tokenMintIntermediate: PubkeyString;
    tokenMintOutput: PubkeyString;
    tokenProgramInput: PubkeyString;
    tokenProgramIntermediate: PubkeyString;
    tokenProgramOutput: PubkeyString;
    tokenOwnerAccountInput : PubkeyString;
    tokenVaultOneInput: PubkeyString;
    tokenVaultOneIntermediate: PubkeyString;
    tokenVaultTwoIntermediate: PubkeyString;
    tokenVaultTwoOutput: PubkeyString;
    tokenOwnerAccountOutput: PubkeyString;
    tokenAuthority: PubkeyString;
    tickArrayOne0: PubkeyString;
    tickArrayOne1: PubkeyString;
    tickArrayOne2: PubkeyString;
    tickArrayTwo0: PubkeyString;
    tickArrayTwo1: PubkeyString;
    tickArrayTwo2: PubkeyString;
    oracleOne: PubkeyString;
    oracleTwo: PubkeyString;
    memoProgram: PubkeyString;
  };
  remainingAccounts: RemainingAccounts;
  transfers: TransferAmountWithTransferFeeConfig[];
};

export type DecodedInitializeConfigExtensionInstruction = {
  name: "initializeConfigExtension";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpoolsConfigExtension: PubkeyString;
    funder: PubkeyString;
    feeAuthority: PubkeyString;
    systemProgram: PubkeyString;
  };
};

export type DecodedInitializeTokenBadgeInstruction = {
  name: "initializeTokenBadge";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpoolsConfigExtension: PubkeyString;
    tokenBadgeAuthority: PubkeyString;
    tokenMint: PubkeyString;
    tokenBadge: PubkeyString;
    funder: PubkeyString;
    systemProgram: PubkeyString;
  };
};

export type DecodedDeleteTokenBadgeInstruction = {
  name: "deleteTokenBadge";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpoolsConfigExtension: PubkeyString;
    tokenBadgeAuthority: PubkeyString;
    tokenMint: PubkeyString;
    tokenBadge: PubkeyString;
    receiver: PubkeyString;
  };
};

export type DecodedSetConfigExtensionAuthorityInstruction = {
  name: "setConfigExtensionAuthority";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpoolsConfigExtension: PubkeyString;
    configExtensionAuthority: PubkeyString;
    newConfigExtensionAuthority: PubkeyString;
  };
};

export type DecodedSetTokenBadgeAuthorityInstruction = {
  name: "setTokenBadgeAuthority";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpoolsConfigExtension: PubkeyString;
    configExtensionAuthority: PubkeyString;
    newTokenBadgeAuthority: PubkeyString;
  };
};

export type DecodedOpenPositionWithTokenExtensionsInstruction = {
  name: "openPositionWithTokenExtensions";
  data: {
    tickLowerIndex: number;
    tickUpperIndex: number;
    withTokenMetadataExtension: boolean;
  };
  accounts: {
    funder: PubkeyString;
    owner: PubkeyString;
    position: PubkeyString;
    positionMint: PubkeyString;
    positionTokenAccount: PubkeyString;
    whirlpool: PubkeyString;
    token2022Program: PubkeyString;
    systemProgram: PubkeyString;
    associatedTokenProgram: PubkeyString;
    metadataUpdateAuth: PubkeyString;
  };
};

export type DecodedClosePositionWithTokenExtensionsInstruction = {
  name: "closePositionWithTokenExtensions";
  data: {};
  accounts: {
    positionAuthority: PubkeyString;
    receiver: PubkeyString;
    position: PubkeyString;
    positionMint: PubkeyString;
    positionTokenAccount: PubkeyString;
    token2022Program: PubkeyString;
  };
};

export type DecodedLockPositionInstruction = {
  name: "lockPosition";
  data: {
    lockType: LockType;
  };
  accounts: {
    funder: PubkeyString;
    positionAuthority: PubkeyString;
    position: PubkeyString;
    positionMint: PubkeyString;
    positionTokenAccount: PubkeyString;
    lockConfig: PubkeyString;
    whirlpool: PubkeyString;
    token2022Program: PubkeyString;
    systemProgram: PubkeyString;
  };
  auxiliaries: {
    positionTokenAccountOwner: PubkeyString;
  };
};

export type DecodedResetPositionRangeInstruction = {
  name: "resetPositionRange";
  data: {
    newTickLowerIndex: number;
    newTickUpperIndex: number;
  };
  accounts: {
    funder: PubkeyString;
    positionAuthority: PubkeyString;
    whirlpool: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    systemProgram: PubkeyString;
  };
};

export type DecodedTransferLockedPositionInstruction = {
  name: "transferLockedPosition";
  data: {};
  accounts: {
    positionAuthority: PubkeyString;
    receiver: PubkeyString;
    position: PubkeyString;
    positionMint: PubkeyString;
    positionTokenAccount: PubkeyString;
    destinationTokenAccount: PubkeyString;
    lockConfig: PubkeyString;
    token2022Program: PubkeyString;
  };
  auxiliaries: {
    destinationTokenAccountOwner: PubkeyString;
  };
};

export type DecodedInitializeAdaptiveFeeTierInstruction = {
  name: "initializeAdaptiveFeeTier";
  data: {
    feeTierIndex: number;
    tickSpacing: number;
    initializePoolAuthority: PubkeyString;
    delegatedFeeAuthority: PubkeyString;
    defaultBaseFeeRate: number;
    filterPeriod: number;
    decayPeriod: number;
    reductionFactor: number;
    adaptiveFeeControlFactor: number;
    maxVolatilityAccumulator: number;
    tickGroupSize: number;
    majorSwapThresholdTicks: number;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    adaptiveFeeTier: PubkeyString;
    funder: PubkeyString;
    feeAuthority: PubkeyString;
    systemProgram: PubkeyString;
  };
};

export type DecodedInitializePoolWithAdaptiveFeeInstruction = {
  name: "initializePoolWithAdaptiveFee";
  data: {
    initialSqrtPrice: BN;
    tradeEnableTimestamp: BN;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    tokenMintA: PubkeyString;
    tokenMintB: PubkeyString;
    tokenBadgeA: PubkeyString;
    tokenBadgeB: PubkeyString;
    funder: PubkeyString;
    initializePoolAuthority: PubkeyString;
    whirlpool: PubkeyString;
    oracle: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    adaptiveFeeTier: PubkeyString;
    tokenProgramA: PubkeyString;
    tokenProgramB: PubkeyString;
    systemProgram: PubkeyString;
    rent: PubkeyString;
  };
  decimals: {
    tokenMintA: number;
    tokenMintB: number;
  };
};

export type DecodedSetDefaultBaseFeeRateInstruction = {
  name: "setDefaultBaseFeeRate";
  data: {
    defaultBaseFeeRate: number;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    adaptiveFeeTier: PubkeyString;
    feeAuthority: PubkeyString;
  };
};

export type DecodedSetDelegatedFeeAuthorityInstruction = {
  name: "setDelegatedFeeAuthority";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    adaptiveFeeTier: PubkeyString;
    feeAuthority: PubkeyString;
    newDelegatedFeeAuthority: PubkeyString;
  };
};

export type DecodedSetInitializePoolAuthorityInstruction = {
  name: "setInitializePoolAuthority";
  data: {};
  accounts: {
    whirlpoolsConfig: PubkeyString;
    adaptiveFeeTier: PubkeyString;
    feeAuthority: PubkeyString;
    newInitializePoolAuthority: PubkeyString;
  };
};

export type DecodedSetPresetAdaptiveFeeConstantsInstruction = {
  name: "setPresetAdaptiveFeeConstants";
  data: {
    filterPeriod: number;
    decayPeriod: number;
    reductionFactor: number;
    adaptiveFeeControlFactor: number;
    maxVolatilityAccumulator: number;
    tickGroupSize: number;
    majorSwapThresholdTicks: number;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    adaptiveFeeTier: PubkeyString;
    feeAuthority: PubkeyString;
  };
};

export type DecodedSetFeeRateByDelegatedFeeAuthorityInstruction = {
  name: "setFeeRateByDelegatedFeeAuthority";
  data: {
    feeRate: number;
  };
  accounts: {
    whirlpool: PubkeyString;
    adaptiveFeeTier: PubkeyString;
    delegatedFeeAuthority: PubkeyString;
  };
};

export type DecodedInitializeDynamicTickArrayInstruction = {
  name: "initializeDynamicTickArray";
  data: {
    startTickIndex: number;
    idempotent: boolean;
  };
  accounts: {
    whirlpool: PubkeyString;
    funder: PubkeyString;
    tickArray: PubkeyString;
    systemProgram: PubkeyString;
  };
};

export type DecodedSetConfigFeatureFlagInstruction = {
  name: "setConfigFeatureFlag";
  data: {
    featureFlag: ConfigFeatureFlag;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    authority: PubkeyString;
  };
};

export type DecodedSetTokenBadgeAttributeInstruction = {
  name: "setTokenBadgeAttribute";
  data: {
    attribute: TokenBadgeAttribute;
  };
  accounts: {
    whirlpoolsConfig: PubkeyString;
    whirlpoolsConfigExtension: PubkeyString;
    tokenBadgeAuthority: PubkeyString;
    tokenMint: PubkeyString;
    tokenBadge: PubkeyString;
  };
};

export type DecodedMigrateRepurposeRewardAuthoritySpaceInstruction = {
  name: "migrateRepurposeRewardAuthoritySpace";
  data: {};
  accounts: {
    whirlpool: PubkeyString;
  };
};

export type DecodedSetAdaptiveFeeConstantsInstruction = {
  name: "setAdaptiveFeeConstants";
  data: {
    filterPeriod: number | null;
    decayPeriod: number | null;
    reductionFactor: number | null;
    adaptiveFeeControlFactor: number | null;
    maxVolatilityAccumulator: number | null;
    tickGroupSize: number | null;
    majorSwapThresholdTicks: number | null;
  };
  accounts: {
    whirlpool: PubkeyString;
    whirlpoolsConfig: PubkeyString;
    oracle: PubkeyString;
    feeAuthority: PubkeyString;
  };
};

export type DecodedRepositionLiquidityV2Instruction = {
  name: "repositionLiquidityV2";
  data: {
    newTickLowerIndex: number;
    newTickUpperIndex: number;
    method: RepositionLiquidityMethod;
    remainingAccountsInfo: RemainingAccountsInfo;
  };
  accounts: {
    whirlpool: PubkeyString;
    tokenProgramA: PubkeyString;
    tokenProgramB: PubkeyString;
    memoProgram: PubkeyString;
    positionAuthority: PubkeyString;
    funder: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    tokenMintA: PubkeyString;
    tokenMintB: PubkeyString;
    tokenOwnerAccountA: PubkeyString;
    tokenOwnerAccountB: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    existingTickArrayLower: PubkeyString;
    existingTickArrayUpper: PubkeyString;
    newTickArrayLower: PubkeyString;
    newTickArrayUpper: PubkeyString;
    systemProgram: PubkeyString;
  };
  remainingAccounts: RemainingAccounts;
  transfers: TransferAmountWithTransferFeeConfig[];
  auxiliaries: {
    isTokenATransferFromOwner: boolean;
    isTokenBTransferFromOwner: boolean;
  };
};

export type DecodedIncreaseLiquidityByTokenAmountsV2Instruction = {
  name: "increaseLiquidityByTokenAmountsV2";
  data: {
    method: IncreaseLiquidityMethod;
    remainingAccountsInfo: RemainingAccountsInfo;
  };
  accounts: {
    whirlpool: PubkeyString;
    tokenProgramA: PubkeyString;
    tokenProgramB: PubkeyString;
    memoProgram: PubkeyString;
    positionAuthority: PubkeyString;
    position: PubkeyString;
    positionTokenAccount: PubkeyString;
    tokenMintA: PubkeyString;
    tokenMintB: PubkeyString;
    tokenOwnerAccountA: PubkeyString;
    tokenOwnerAccountB: PubkeyString;
    tokenVaultA: PubkeyString;
    tokenVaultB: PubkeyString;
    tickArrayLower: PubkeyString;
    tickArrayUpper: PubkeyString;
  };
  remainingAccounts: RemainingAccounts;
  transfers: TransferAmountWithTransferFeeConfig[];
};
