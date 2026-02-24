import { BorshCoder, Idl, Instruction as AnchorInstruction, BN } from "@coral-xyz/anchor";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, transferInstructionData, transferCheckedInstructionData } from "@solana/spl-token";
import invariant from "tiny-invariant"
import bs58 from "bs58";
import {
  PubkeyString,
  TransferAmount,
  TransactionJSON,
  InstructionJSON,
  Instruction,
  DecodedWhirlpoolInstruction,
  DecodedSwapInstruction,
  DecodedTwoHopSwapInstruction,
  DecodedOpenPositionInstruction,
  DecodedOpenPositionWithMetadataInstruction,
  DecodedIncreaseLiquidityInstruction,
  DecodedDecreaseLiquidityInstruction,
  DecodedUpdateFeesAndRewardsInstruction,
  DecodedCollectFeesInstruction,
  DecodedCollectRewardInstruction,
  DecodedClosePositionInstruction,
  DecodedCollectProtocolFeesInstruction,
  DecodedAdminIncreaseLiquidityInstruction,
  DecodedInitializeConfigInstruction,
  DecodedInitializeFeeTierInstruction,
  DecodedInitializePoolInstruction,
  DecodedInitializePositionBundleInstruction,
  DecodedInitializePositionBundleWithMetadataInstruction,
  DecodedInitializeRewardInstruction,
  DecodedInitializeTickArrayInstruction,
  DecodedDeletePositionBundleInstruction,
  DecodedOpenBundledPositionInstruction,
  DecodedCloseBundledPositionInstruction,
  DecodedSetCollectProtocolFeesAuthorityInstruction,
  DecodedSetDefaultFeeRateInstruction,
  DecodedSetDefaultProtocolFeeRateInstruction,
  DecodedSetFeeAuthorityInstruction,
  DecodedSetFeeRateInstruction,
  DecodedSetProtocolFeeRateInstruction,
  DecodedSetRewardAuthorityInstruction,
  DecodedSetRewardAuthorityBySuperAuthorityInstruction,
  DecodedSetRewardEmissionsInstruction,
  DecodedSetRewardEmissionsSuperAuthorityInstruction,
  DecodedCollectFeesV2Instruction,
  DecodedCollectProtocolFeesV2Instruction,
  DecodedCollectRewardV2Instruction,
  DecodedDecreaseLiquidityV2Instruction,
  DecodedIncreaseLiquidityV2Instruction,
  DecodedInitializePoolV2Instruction,
  DecodedInitializeRewardV2Instruction,
  DecodedSetRewardEmissionsV2Instruction,
  DecodedSwapV2Instruction,
  DecodedTwoHopSwapV2Instruction,
  DecodedInitializeConfigExtensionInstruction,
  DecodedInitializeTokenBadgeInstruction,
  DecodedDeleteTokenBadgeInstruction,
  DecodedSetConfigExtensionAuthorityInstruction,
  DecodedSetTokenBadgeAuthorityInstruction,
  DecodedOpenPositionWithTokenExtensionsInstruction,
  DecodedClosePositionWithTokenExtensionsInstruction,
  DecodedLockPositionInstruction,
  TransferAmountWithTransferFeeConfig,
  RemainingAccountsInfo,
  RemainingAccountsType,
  DecimalsMap,
  LockType,
  DecodedResetPositionRangeInstruction,
  DecodedTransferLockedPositionInstruction,
  TokenAccountOwnerMap,
  DecodedInitializeAdaptiveFeeTierInstruction,
  DecodedInitializePoolWithAdaptiveFeeInstruction,
  DecodedSetDefaultBaseFeeRateInstruction,
  DecodedSetDelegatedFeeAuthorityInstruction,
  DecodedSetInitializePoolAuthorityInstruction,
  DecodedSetFeeRateByDelegatedFeeAuthorityInstruction,
  DecodedSetPresetAdaptiveFeeConstantsInstruction,
  DecodedInitializeDynamicTickArrayInstruction,
  ConfigFeatureFlag,
  TokenBadgeAttribute,
  DecodedSetConfigFeatureFlagInstruction,
  DecodedSetTokenBadgeAttributeInstruction,
  DecodedMigrateRepurposeRewardAuthoritySpaceInstruction,
  DecodedSetAdaptiveFeeConstantsInstruction,
  DecodedRepositionLiquidityV2Instruction,
  DecodedIncreaseLiquidityByTokenAmountsV2Instruction,
  RepositionLiquidityMethod,
  IncreaseLiquidityMethod,
  TransferAmountWithTransferFeeConfigAndAccounts,
} from "./types";

// IDL
import whirlpoolIDL from "./whirlpool.idl.json";

const TOKEN_PROGRAM_ID_STRING = TOKEN_PROGRAM_ID.toBase58();
const TOKEN_2022_PROGRAM_ID_STRING = TOKEN_2022_PROGRAM_ID.toBase58();
const MEMO_PROGRAM_ID_STRING = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
const BPF_UPGRADABLE_LOADER_ID_STRING = "BPFLoaderUpgradeab1e11111111111111111111111";

// IDL IX: https://github.com/coral-xyz/anchor/blob/master/lang/src/idl.rs
// - https://solscan.io/tx/5wM76xyEEPi87AAW8Lo6B5wLs45Q3bBW81mWTMK9Jou5KRSUpx7Duyqm4zXDY9SUXTbvWFCtUfE5SeQPzRdiA1vH
// - https://solscan.io/tx/kuxdXN5pexa4iTorzt7eFTQrJjtTgxKRRzVgyyjUKJDofh3B6VF5nSQh9Zj4rKD4xz9ZacAgBgFZv1cKdDidSNK
// - https://solscan.io/tx/3d9Scxo6V3gRBYahzukH7opSdSPZsxjN6rvTs59Tstdvz3wvZmcUucfRha1Y2iPjGpATLs9g13mjKDH6FNNoUM8i
// - https://solscan.io/tx/5NVzf3NqVz3TfG49mwq28CdrMDbqmPKRHjXrg9HBZwRF3YtKFzDa21v3L31Tt9nrQmeeQDZRsPtnEQR3tbXVWaQi
const IDL_IX_TAG = [0x40, 0xf4, 0xbc, 0x78, 0xa7, 0xe9, 0x69, 0x0a];

const TRANSFER_FEE_CONFIG_MEMO_REGEX = /^TFe: (\d+), (\d+)$/;
const TRANSFER_FEE_CONFIG_MEMO_PREFIX = "TFe: ";
const MEMO_TRANSFER_MEMO_PREFIX = "Orca ";

const PUBKEY_STRING_PLACEHOLDER = "<PubkeyString>";

export class WhirlpoolTransactionDecoder {
  private static coder = new BorshCoder<string, string>(whirlpoolIDL as Idl);
  private static textDecoder = new TextDecoder();

  public static decode(transaction: TransactionJSON, whirlpoolProgramId: PubkeyString): DecodedWhirlpoolInstruction[] {
    return this.decodeWithProgramDeployDetection(transaction, whirlpoolProgramId).decodedInstructions;
  }

  public static decodeWithProgramDeployDetection(transaction: TransactionJSON, whirlpoolProgramId: PubkeyString): {
    decodedInstructions: DecodedWhirlpoolInstruction[];
    programDeployDetected: boolean;
  } {
    const instructions = this.pickInstructions(transaction);

    let programDeployDetected = false;
    const decodedInstructions: DecodedWhirlpoolInstruction[] = [];
    for (let i=0; i< instructions.length; i++) {
      const ix = instructions[i];

      // program deploy instruction (DeployWithMaxDataLen or Upgrade)
      if (this.isProgramDeployInstruction(ix, whirlpoolProgramId)) {
        invariant(!programDeployDetected, "Multiple program deployment detected");
        programDeployDetected = true;
        continue;
      }

      if (ix.programId !== whirlpoolProgramId) continue;

      // ignore IDL instructions
      if (this.isIDLInstruction(ix.dataBase58)) continue;

      const decoded = this.coder.instruction.decode(ix.dataBase58, "base58");
      if (!decoded) {
        throw new Error("failed to decode whirlpool instruction");
      }

      switch (decoded.name) {
        case "closeBundledPosition":
          decodedInstructions.push(this.decodeCloseBundledPositionInstruction(decoded, ix.accounts));
          break;
        case "closePosition":
          decodedInstructions.push(this.decodeClosePositionInstruction(decoded, ix.accounts));
          break;
        case "collectFees":
          decodedInstructions.push(this.decodeCollectFeesInstruction(decoded, ix.accounts, this.decodeTransferInstructions(instructions.slice(i+1, i+1+2))));
          break;
        case "collectProtocolFees":
          decodedInstructions.push(this.decodeCollectProtocolFeesInstruction(decoded, ix.accounts, this.decodeTransferInstructions(instructions.slice(i+1, i+1+2))));
          break;
        case "collectReward":
          decodedInstructions.push(this.decodeCollectRewardInstruction(decoded, ix.accounts, this.decodeTransferInstructions(instructions.slice(i+1, i+1+1))));
          break;
        case "decreaseLiquidity":
          decodedInstructions.push(this.decodeDecreaseLiquidityInstruction(decoded, ix.accounts, this.decodeTransferInstructions(instructions.slice(i+1, i+1+2))));
          break;
        case "deletePositionBundle":
          decodedInstructions.push(this.decodeDeletePositionBundleInstruction(decoded, ix.accounts));
          break;
        case "increaseLiquidity":
          decodedInstructions.push(this.decodeIncreaseLiquidityInstruction(decoded, ix.accounts, this.decodeTransferInstructions(instructions.slice(i+1, i+1+2))));
          break;
        case "initializeConfig":
          decodedInstructions.push(this.decodeInitializeConfigInstruction(decoded, ix.accounts));
          break;
        case "initializeFeeTier":
          decodedInstructions.push(this.decodeInitializeFeeTierInstruction(decoded, ix.accounts));
          break;
        case "initializePool":
          decodedInstructions.push(this.decodeInitializePoolInstruction(decoded, ix.accounts, this.pickDecimals(transaction)));
          break;
        case "initializePositionBundle":
          decodedInstructions.push(this.decodeInitializePositionBundleInstruction(decoded, ix.accounts));
          break;
        case "initializePositionBundleWithMetadata":
          decodedInstructions.push(this.decodeInitializePositionBundleWithMetadataInstruction(decoded, ix.accounts));
          break;
        case "initializeReward":
          decodedInstructions.push(this.decodeInitializeRewardInstruction(decoded, ix.accounts, this.pickDecimals(transaction)));
          break;
        case "initializeTickArray":
          decodedInstructions.push(this.decodeInitializeTickArrayInstruction(decoded, ix.accounts));
          break;
        case "openBundledPosition":
          decodedInstructions.push(this.decodeOpenBundledPositionInstruction(decoded, ix.accounts));
          break;
        case "openPosition":
          decodedInstructions.push(this.decodeOpenPositionInstruction(decoded, ix.accounts));
          break;
        case "openPositionWithMetadata":
          decodedInstructions.push(this.decodeOpenPositionWithMetadataInstruction(decoded, ix.accounts));
          break;
        case "setCollectProtocolFeesAuthority":
          decodedInstructions.push(this.decodeSetCollectProtocolFeesAuthorityInstruction(decoded, ix.accounts));
          break;
        case "setDefaultFeeRate":
          decodedInstructions.push(this.decodeSetDefaultFeeRateInstruction(decoded, ix.accounts));
          break;
        case "setDefaultProtocolFeeRate":
          decodedInstructions.push(this.decodeSetDefaultProtocolFeeRateInstruction(decoded, ix.accounts));
          break;
        case "setFeeAuthority":
          decodedInstructions.push(this.decodeSetFeeAuthorityInstruction(decoded, ix.accounts));
          break;
        case "setFeeRate":
          decodedInstructions.push(this.decodeSetFeeRateInstruction(decoded, ix.accounts));
          break;
        case "setProtocolFeeRate":
          decodedInstructions.push(this.decodeSetProtocolFeeRateInstruction(decoded, ix.accounts));
          break;
        case "setRewardAuthority":
          decodedInstructions.push(this.decodeSetRewardAuthorityInstruction(decoded, ix.accounts));
          break;
        case "setRewardAuthorityBySuperAuthority":
          decodedInstructions.push(this.decodeSetRewardAuthorityBySuperAuthorityInstruction(decoded, ix.accounts));
          break;
        case "setRewardEmissions":
          decodedInstructions.push(this.decodeSetRewardEmissionsInstruction(decoded, ix.accounts));
          break;
        case "setRewardEmissionsSuperAuthority":
          decodedInstructions.push(this.decodeSetRewardEmissionsSuperAuthorityInstruction(decoded, ix.accounts));
          break;
        case "swap":
          if (ix.accounts.length === 10 && transaction.result.transaction.signatures[0] === "42cBuWXNV1JMR6edFnup98JDq3wvrU3fdqwwp22CBNVw1QVoDEEeeU8Zs5NbSdXuBziBwGN9gMhu76mhsVkMRA9R") {
            // special patch for old swap instruction without oracle account (slot at 124,291,577 (2022/03/10))
            decodedInstructions.push(this.decodeSwapInstruction(decoded, [...ix.accounts, "FjUxBnbLJkc5juiPYyh1oEQbE9a6coknjgFfzh4rd3bp"], this.decodeTransferInstructions(instructions.slice(i+1, i+1+2))));
          } else {
            decodedInstructions.push(this.decodeSwapInstruction(decoded, ix.accounts, this.decodeTransferInstructions(instructions.slice(i+1, i+1+2))));
          }
          break;
        case "twoHopSwap":
          decodedInstructions.push(this.decodeTwoHopSwapInstruction(decoded, ix.accounts, this.decodeTransferInstructions(instructions.slice(i+1, i+1+4))));
          break;
        case "updateFeesAndRewards":
          decodedInstructions.push(this.decodeUpdateFeesAndRewardsInstruction(decoded, ix.accounts));
          break;
        // V2
        case "collectFeesV2":
          decodedInstructions.push(this.decodeCollectFeesV2Instruction(decoded, ix.accounts, this.decodeV2TransferInstructions(2, instructions.slice(i+1))));
          break;
        case "collectProtocolFeesV2":
          decodedInstructions.push(this.decodeCollectProtocolFeesV2Instruction(decoded, ix.accounts, this.decodeV2TransferInstructions(2, instructions.slice(i+1))));
          break;
        case "collectRewardV2":
          decodedInstructions.push(this.decodeCollectRewardV2Instruction(decoded, ix.accounts, this.decodeV2TransferInstructions(1, instructions.slice(i+1))));
          break;
        case "decreaseLiquidityV2":
          decodedInstructions.push(this.decodeDecreaseLiquidityV2Instruction(decoded, ix.accounts, this.decodeV2TransferInstructions(2, instructions.slice(i+1))));
          break;
        case "increaseLiquidityV2":
          decodedInstructions.push(this.decodeIncreaseLiquidityV2Instruction(decoded, ix.accounts, this.decodeV2TransferInstructions(2, instructions.slice(i+1))));
          break;
        case "initializePoolV2":
          decodedInstructions.push(this.decodeInitializePoolV2Instruction(decoded, ix.accounts, this.pickDecimals(transaction)));
          break;
        case "initializeRewardV2":
          decodedInstructions.push(this.decodeInitializeRewardV2Instruction(decoded, ix.accounts, this.pickDecimals(transaction)));
          break;
        case "setRewardEmissionsV2":
          decodedInstructions.push(this.decodeSetRewardEmissionsV2Instruction(decoded, ix.accounts));
          break;
        case "swapV2":
          decodedInstructions.push(this.decodeSwapV2Instruction(decoded, ix.accounts, this.decodeV2TransferInstructions(2, instructions.slice(i+1))));
          break;
        case "twoHopSwapV2":
          decodedInstructions.push(this.decodeTwoHopSwapV2Instruction(decoded, ix.accounts, this.decodeV2TransferInstructions(3, instructions.slice(i+1))));
          break;
        // ConfigExtension & TokenBadge
        case "initializeConfigExtension":
          decodedInstructions.push(this.decodeInitializeConfigExtensionInstruction(decoded, ix.accounts));
          break;
        case "initializeTokenBadge":
          decodedInstructions.push(this.decodeInitializeTokenBadgeInstruction(decoded, ix.accounts));
          break;
        case "deleteTokenBadge":
          decodedInstructions.push(this.decodeDeleteTokenBadgeInstruction(decoded, ix.accounts));
          break;
        case "setConfigExtensionAuthority":
          decodedInstructions.push(this.decodeSetConfigExtensionAuthorityInstruction(decoded, ix.accounts));
          break;
        case "setTokenBadgeAuthority":
          decodedInstructions.push(this.decodeSetTokenBadgeAuthorityInstruction(decoded, ix.accounts));
          break;
        // TokenExtensions based Position NFT
        case "openPositionWithTokenExtensions":
          decodedInstructions.push(this.decodeOpenPositionWithTokenExtensionsInstruction(decoded, ix.accounts));
          break;
        case "closePositionWithTokenExtensions":
          decodedInstructions.push(this.decodeClosePositionWithTokenExtensionsInstruction(decoded, ix.accounts));
          break;
        // Liquidity Locking
        case "lockPosition":
          decodedInstructions.push(this.decodeLockPositionInstruction(decoded, ix.accounts));
          break;
        case "transferLockedPosition":
          decodedInstructions.push(this.decodeTransferLockedPositionInstruction(decoded, ix.accounts));
          break;
        // Reset Position Range
        case "resetPositionRange":
          decodedInstructions.push(this.decodeResetPositionRangeInstruction(decoded, ix.accounts));
          break;
        // Adaptive Fee
        case "initializeAdaptiveFeeTier":
          decodedInstructions.push(this.decodeInitializeAdaptiveFeeTierInstruction(decoded, ix.accounts));
          break;
        case "initializePoolWithAdaptiveFee":
          decodedInstructions.push(this.decodeInitializePoolWithAdaptiveFeeInstruction(decoded, ix.accounts, this.pickDecimals(transaction)));
          break;
        case "setDefaultBaseFeeRate":
          decodedInstructions.push(this.decodeSetDefaultBaseFeeRateInstruction(decoded, ix.accounts));
          break;
        case "setDelegatedFeeAuthority":
          decodedInstructions.push(this.decodeSetDelegatedFeeAuthorityInstruction(decoded, ix.accounts));
          break;
        case "setInitializePoolAuthority":
          decodedInstructions.push(this.decodeSetInitializePoolAuthorityInstruction(decoded, ix.accounts));
          break;
        case "setPresetAdaptiveFeeConstants":
          decodedInstructions.push(this.decodeSetPresetAdaptiveFeeConstantsInstruction(decoded, ix.accounts));
          break;
        case "setFeeRateByDelegatedFeeAuthority":
          decodedInstructions.push(this.decodeSetFeeRateByDelegatedFeeAuthorityInstruction(decoded, ix.accounts));
          break;
        // Dynamic Tick Array
        case "initializeDynamicTickArray":
          decodedInstructions.push(this.decodeInitializeDynamicTickArrayInstruction(decoded, ix.accounts));
          break;
        // Non Transferable Position
        case "setConfigFeatureFlag":
          decodedInstructions.push(this.decodeSetConfigFeatureFlagInstruction(decoded, ix.accounts));
          break;
        case "setTokenBadgeAttribute":
          decodedInstructions.push(this.decodeSetTokenBadgeAttributeInstruction(decoded, ix.accounts));
          break;
        case "setAdaptiveFeeConstants":
          decodedInstructions.push(this.decodeSetAdaptiveFeeConstantsInstruction(decoded, ix.accounts));
          break;
        case "repositionLiquidityV2":
          decodedInstructions.push(this.decodeRepositionLiquidityV2Instruction(decoded, ix.accounts, this.decodeV2TransferInstructions(2, instructions.slice(i+1))));
          break;
        case "increaseLiquidityByTokenAmountsV2":
          decodedInstructions.push(this.decodeIncreaseLiquidityByTokenAmountsInstruction(decoded, ix.accounts, this.decodeV2TransferInstructions(2, instructions.slice(i+1))));
          break;
        // Migrate / Repurpose Reward Authority Space
        case "migrateRepurposeRewardAuthoritySpace":
          decodedInstructions.push(this.decodeMigrateRepurposeRewardAuthoritySpaceInstruction(decoded, ix.accounts));
          break;
        // It no longer exists today. (used to fix a bug)
        case "adminIncreaseLiquidity":
          decodedInstructions.push(this.decodeAdminIncreaseLiquidityInstruction(decoded, ix.accounts));
          break;
        default:
          // unknown instruction
          throw new Error("unknown whirlpool instruction");
      }
    }

    this.resolveLockRelatedAuxiliaries(decodedInstructions, transaction);

    return {
      decodedInstructions,
      programDeployDetected,
    };
  }

  private static isIDLInstruction(dataBase58: string): boolean {
    const dataU8array: Uint8Array = bs58.decode(dataBase58);
    if (dataU8array.length < IDL_IX_TAG.length) return false;
    return IDL_IX_TAG.every((v, i) => v === dataU8array[i]);
  }

  private static isProgramDeployInstruction(ix: Instruction, whirlpoolProgramId: PubkeyString): boolean {
    if (ix.programId !== BPF_UPGRADABLE_LOADER_ID_STRING) return false;

    // BPF Upgradable Loader instructions
    // https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/loader_upgradeable_instruction.rs#L7

    const dataU8array = bs58.decode(ix.dataBase58);
    const dataBuffer = Buffer.from(dataU8array);
    invariant(dataBuffer.length >= 4, "Invalid data length");
    const instructionCode = dataBuffer.readUint32LE(0);
    
    switch (instructionCode) {
      case 2:
        // DeployWithMaxDataLen
        // 3rd account is the program id
        return ix.accounts[2] === whirlpoolProgramId;
      case 3:
        // Upgrade
        // 2nd account is the program id
        return ix.accounts[1] === whirlpoolProgramId;
      default:
        return false;
    }
  }

  private static pickInstructions(transaction: TransactionJSON): Instruction[] {
    const meta = transaction.result.meta;
    const message = transaction.result.transaction.message;
    const instructions = message.instructions;
    const accounts = message.accountKeys.slice(); // shallow copy

    // loaded from ALT, order is accountKeys, writable, readonly
    meta.loadedAddresses?.writable.forEach((k) => accounts.push(k));
    meta.loadedAddresses?.readonly.forEach((k) => accounts.push(k));
    const innerInstructions = meta.innerInstructions ?? [];
  
    // flatten all instructions
    const allInstructions: InstructionJSON[] = [];
    instructions.forEach((ix, i) => {
      allInstructions.push(ix);
      const inner = innerInstructions.find((v) => v.index == i);
      inner?.instructions.forEach((ix) => allInstructions.push(ix));
    });
    
    const decodedInstructions: Instruction[] = [];
    for (let cursor = 0; cursor < allInstructions.length; cursor++) {
      const ix = allInstructions[cursor];
      decodedInstructions.push({
        stackHeight: ix.stackHeight,
        programId: accounts[ix.programIdIndex],
        accounts: ix.accounts.map((i) => accounts[i]),
        dataBase58: ix.data,
      });
    }

    return decodedInstructions;
  }

  private static pickDecimals(transaction: TransactionJSON): DecimalsMap {
    const meta = transaction.result.meta;

    invariant(meta.postTokenBalances !== undefined, "Post token balances is undefined");
    const decimalsMap = meta.postTokenBalances.reduce((map, balance) => {
      const mint = balance.mint;
      const decimals = balance.uiTokenAmount?.decimals;
      invariant(mint !== undefined, "Mint is undefined");
      invariant(decimals !== undefined, "Decimals is undefined");
      map[mint] = decimals;
      return map;
    }, {});

    return decimalsMap;
  }

  private static pickPostTokenAccountOwner(transaction: TransactionJSON): TokenAccountOwnerMap {
    const meta = transaction.result.meta;
    const message = transaction.result.transaction.message;
    const accounts = message.accountKeys.slice(); // shallow copy

    // loaded from ALT, order is accountKeys, writable, readonly
    meta.loadedAddresses?.writable.forEach((k) => accounts.push(k));
    meta.loadedAddresses?.readonly.forEach((k) => accounts.push(k));

    invariant(meta.postTokenBalances !== undefined, "Post token balances is undefined");
    const postTokenAccountOwnerMap = meta.postTokenBalances.reduce((map, balance) => {
      const account = accounts[balance.accountIndex];
      const owner = balance.owner;
      invariant(account !== undefined, "Account is undefined");
      invariant(owner !== undefined, "Owner is undefined");
      map[account] = owner;
      return map;
    }, {});

    return postTokenAccountOwnerMap;
  }

  private static resolveLockRelatedAuxiliaries(decodedInstructions: DecodedWhirlpoolInstruction[], transaction: TransactionJSON) {
    // Currently, the target is only lockPosition and transferLockedPosition

    const lockRelatedInstructionsGroupByPosition = new Map<string, (DecodedLockPositionInstruction | DecodedTransferLockedPositionInstruction)[]>();
    for (const ix of decodedInstructions) {
      if (ix.name !== "lockPosition" && ix.name !== "transferLockedPosition") continue;

      const position = ix.accounts.position;
      if (!lockRelatedInstructionsGroupByPosition.has(position)) {
        lockRelatedInstructionsGroupByPosition.set(position, []);
      }
      lockRelatedInstructionsGroupByPosition.get(position)!.push(ix);
    }
    if (lockRelatedInstructionsGroupByPosition.size === 0) return;

    const postTokenAccountOwnerMap = this.pickPostTokenAccountOwner(transaction);

    // available instruction flow for a specific position in a single transaction
    // note: at the moment, Whirlpool does not support unlocking, so lockPosition never comes after transferLockedPosition.
    // note: transferLockedPosition can be executed by the owner (delegation is not allowed),
    //       so position authority of transferLockedPosition is always the owner of the position token account.
    // note: Because token account is frozen, post token account balance of the last position token account should be always 1.
    //
    // - lockPosition
    // - transferLockedPosition
    // - lockPosition, transferLockedPosition x N
    // - transferLockedPosition x N
    //
    for (const instructions of lockRelatedInstructionsGroupByPosition.values()) {
      for (let i = 0; i < instructions.length; i++) {
        const ix = instructions[i];
        const nextInstruction = i + 1 < instructions.length ? instructions[i + 1] : null;

        if (ix.name === "lockPosition") {
          // lockPosition
          invariant(ix.auxiliaries.positionTokenAccountOwner === PUBKEY_STRING_PLACEHOLDER);

          if (!nextInstruction) {
            const positionTokenAccountOwner = postTokenAccountOwnerMap[ix.accounts.positionTokenAccount];
            invariant(positionTokenAccountOwner !== undefined, "positionTokenAccount is not found in postTokenAccountOwnerMap");
            ix.auxiliaries.positionTokenAccountOwner = positionTokenAccountOwner;
          } else {
            // next instruction must be transferLockedPosition
            invariant(nextInstruction.name === "transferLockedPosition", "Invalid next instruction");
            invariant(nextInstruction.accounts.positionTokenAccount === ix.accounts.positionTokenAccount, "Invalid token account");
            ix.auxiliaries.positionTokenAccountOwner = nextInstruction.accounts.positionAuthority;
          }

          invariant(ix.auxiliaries.positionTokenAccountOwner !== PUBKEY_STRING_PLACEHOLDER, "positionTokenAccountOwner is not resolved");
        } else if (ix.name === "transferLockedPosition") {
          // transferLockedPosition
          invariant(ix.auxiliaries.destinationTokenAccountOwner === PUBKEY_STRING_PLACEHOLDER);

          if (!nextInstruction) {
            const destinationTokenAccountOwner = postTokenAccountOwnerMap[ix.accounts.destinationTokenAccount];
            invariant(destinationTokenAccountOwner !== undefined, "destinationTokenAccount is not found in postTokenAccountOwnerMap");
            ix.auxiliaries.destinationTokenAccountOwner = destinationTokenAccountOwner;
          } else {
            // next instruction must be transferLockedPosition
            invariant(nextInstruction.name === "transferLockedPosition", "Invalid next instruction");
            invariant(nextInstruction.accounts.positionTokenAccount === ix.accounts.destinationTokenAccount, "Invalid token account");
            ix.auxiliaries.destinationTokenAccountOwner = nextInstruction.accounts.positionAuthority;
          }

          invariant(ix.auxiliaries.destinationTokenAccountOwner !== PUBKEY_STRING_PLACEHOLDER, "destinationTokenAccountOwner is not resolved");
        } else {
          invariant(false, "unreachable");
        }
      }
    }
  }

  private static decodeTransferInstructions(ixs: Instruction[]): TransferAmount[] {
    return ixs.map((ix) => this.decodeTransferInstruction(ix));
  }

  private static decodeTransferInstruction(ix: Instruction): TransferAmount {
    invariant(ix.programId === TOKEN_PROGRAM_ID_STRING, "Invalid program id");
    invariant(ix.accounts.length >= 3, "Invalid number of accounts");

    const dataU8array = bs58.decode(ix.dataBase58);
    const decoded = transferInstructionData.decode(dataU8array);

    return decoded.amount;
  }

  private static decodeTransferCheckedInstruction(ix: Instruction): TransferAmount {
    invariant(ix.programId === TOKEN_PROGRAM_ID_STRING || ix.programId === TOKEN_2022_PROGRAM_ID_STRING, "Invalid program id");
    invariant(ix.accounts.length >= 4, "Invalid number of accounts");

    const dataU8array = bs58.decode(ix.dataBase58);
    const decoded = transferCheckedInstructionData.decode(dataU8array);

    return decoded.amount;
  }

  private static decodeRemainingAccountsInfo(remainingAccountsInfo: { slices: { accountsType: { [k: string]: object }, length: number }[] } | null): RemainingAccountsInfo {
    if (remainingAccountsInfo === null) return [];

    const result = remainingAccountsInfo.slices.map((r) => {
      invariant("accountsType" in r, "Invalid accounts type");
      invariant("length" in r, "Invalid length");

      const length = r.length;
      const keys = Object.keys(r.accountsType);
      invariant(keys.length === 1, "Invalid accounts type");
      switch (keys[0]) {
        case "transferHookA": return { accountsType: RemainingAccountsType.TransferHookA, length };
        case "transferHookB": return { accountsType: RemainingAccountsType.TransferHookB, length };
        case "transferHookReward": return { accountsType: RemainingAccountsType.TransferHookReward, length };
        case "transferHookInput": return { accountsType: RemainingAccountsType.TransferHookInput, length };
        case "transferHookIntermediate": return { accountsType: RemainingAccountsType.TransferHookIntermediate, length };
        case "transferHookOutput": return { accountsType: RemainingAccountsType.TransferHookOutput, length };
        case "supplementalTickArrays": return { accountsType: RemainingAccountsType.SupplementalTickArrays, length };
        case "supplementalTickArraysOne": return { accountsType: RemainingAccountsType.SupplementalTickArraysOne, length };
        case "supplementalTickArraysTwo": return { accountsType: RemainingAccountsType.SupplementalTickArraysTwo, length };
        case "transferHookDepositA": return { accountsType: RemainingAccountsType.TransferHookDepositA, length };
        case "transferHookDepositB": return { accountsType: RemainingAccountsType.TransferHookDepositB, length };
        case "transferHookWithdrawalA": return { accountsType: RemainingAccountsType.TransferHookWithdrawalA, length };
        case "transferHookWithdrawalB": return { accountsType: RemainingAccountsType.TransferHookWithdrawalB, length };
        default:
          invariant(false, `Unknown account type: ${keys[0]}`);
      }
    });
    return result;
  }

  private static decodeLockType(lockType: { [k: string]: object }): LockType {
    const keys = Object.keys(lockType);
    invariant(keys.length === 1, "Invalid lock type");
    const key = keys[0];

    switch (key) {
      case "permanent":
        return { name: "permanent" };
      default:
        invariant(false, `Unknown lock type: ${key}`);
    }
  }

  private static decodeConfigFeatureFlag(featureFlag: { [k: string]: object }): ConfigFeatureFlag {
    const keys = Object.keys(featureFlag);
    invariant(keys.length === 1, "Invalid config feature flag");
    const key = keys[0];

    const variant = featureFlag[key];
    invariant(!!variant && typeof variant === "object", "Invalid config feature flag object");

    switch (key) {
      case "tokenBadge":
        invariant("0" in variant, "Invalid tokenBadge variant");
        invariant(typeof variant["0"] === "boolean", "Invalid tokenBadge variant[0] type");
        return { name: "tokenBadge", enabled: variant["0"] };
      default:
        invariant(false, `Unknown feature flag: ${key}`);
    }
  }

  private static decodeTokenBadgeAttribute(attribute: { [k: string]: object }): TokenBadgeAttribute {
    const keys = Object.keys(attribute);
    invariant(keys.length === 1, "Invalid token badge attribute");
    const key = keys[0];

    const variant = attribute[key];
    invariant(!!variant && typeof variant === "object", "Invalid token badge attribute object");

    switch (key) {
      case "requireNonTransferablePosition":
        invariant("0" in variant, "Invalid requireNonTransferablePosition variant");
        invariant(typeof variant["0"] === "boolean", "Invalid requireNonTransferablePosition variant[0] type");
        return { name: "requireNonTransferablePosition", required: variant["0"] };
      default:
        invariant(false, `Unknown token badge attribute: ${key}`);
    }
  }

  private static decodeRepositionLiquidityMethod(method: { [k: string]: object }): RepositionLiquidityMethod {
    const keys = Object.keys(method);
    invariant(keys.length === 1, "Invalid reposition liquidity method");
    const key = keys[0];

    const variant = method[key];
    invariant(!!variant && typeof variant === "object", "Invalid reposition liquidity method object");

    switch (key) {
      case "byLiquidity":
        invariant("newLiquidityAmount" in variant, "Invalid byLiquidity variant: missing newLiquidityAmount");
        invariant(BN.isBN(variant["newLiquidityAmount"]), "Invalid byLiquidity variant: newLiquidityAmount is not BN");
        invariant("existingRangeTokenMinA" in variant, "Invalid byLiquidity variant: missing existingRangeTokenMinA");
        invariant(BN.isBN(variant["existingRangeTokenMinA"]), "Invalid byLiquidity variant: existingRangeTokenMinA is not BN");
        invariant("existingRangeTokenMinB" in variant, "Invalid byLiquidity variant: missing existingRangeTokenMinB");
        invariant(BN.isBN(variant["existingRangeTokenMinB"]), "Invalid byLiquidity variant: existingRangeTokenMinB is not BN");
        invariant("newRangeTokenMaxA" in variant, "Invalid byLiquidity variant: missing newRangeTokenMaxA");
        invariant(BN.isBN(variant["newRangeTokenMaxA"]), "Invalid byLiquidity variant: newRangeTokenMaxA is not BN");
        invariant("newRangeTokenMaxB" in variant, "Invalid byLiquidity variant: missing newRangeTokenMaxB");
        invariant(BN.isBN(variant["newRangeTokenMaxB"]), "Invalid byLiquidity variant: newRangeTokenMaxB is not BN");
        return {
          name: "byLiquidity",
          newLiquidityAmount: variant["newLiquidityAmount"] as BN,
          existingRangeTokenMinA: variant["existingRangeTokenMinA"] as BN,
          existingRangeTokenMinB: variant["existingRangeTokenMinB"] as BN,
          newRangeTokenMaxA: variant["newRangeTokenMaxA"] as BN,
          newRangeTokenMaxB: variant["newRangeTokenMaxB"] as BN,
        };
      default:
        invariant(false, `Unknown reposition liquidity method: ${key}`);
    }
  }

  private static decodeIncreaseLiquidityMethod(method: { [k: string]: object }): IncreaseLiquidityMethod {
    const keys = Object.keys(method);
    invariant(keys.length === 1, "Invalid increase liquidity method");
    const key = keys[0];

    const variant = method[key];
    invariant(!!variant && typeof variant === "object", "Invalid increase liquidity method object");

    switch (key) {
      case "byTokenAmounts":
        invariant("tokenMaxA" in variant, "Invalid byTokenAmounts variant: missing tokenMaxA");
        invariant(BN.isBN(variant["tokenMaxA"]), "Invalid byTokenAmounts variant: tokenMaxA is not BN");
        invariant("tokenMaxB" in variant, "Invalid byTokenAmounts variant: missing tokenMaxB");
        invariant(BN.isBN(variant["tokenMaxB"]), "Invalid byTokenAmounts variant: tokenMaxB is not BN");
        invariant("minSqrtPrice" in variant, "Invalid byTokenAmounts variant: missing minSqrtPrice");
        invariant(BN.isBN(variant["minSqrtPrice"]), "Invalid byTokenAmounts variant: minSqrtPrice is not BN");
        invariant("maxSqrtPrice" in variant, "Invalid byTokenAmounts variant: missing maxSqrtPrice");
        invariant(BN.isBN(variant["maxSqrtPrice"]), "Invalid byTokenAmounts variant: maxSqrtPrice is not BN");
        return {
          name: "byTokenAmounts",
          tokenMaxA: variant["tokenMaxA"] as BN,
          tokenMaxB: variant["tokenMaxB"] as BN,
          minSqrtPrice: variant["minSqrtPrice"] as BN,
          maxSqrtPrice: variant["maxSqrtPrice"] as BN,
        };
      default:
        invariant(false, `Unknown increase liquidity method: ${key}`);
    }
  }

  private static decodeV2TransferInstructions(expectedTransfers: number, followingInstructions: Instruction[]): TransferAmountWithTransferFeeConfigAndAccounts[] {
    invariant(followingInstructions.length >= 1, "Invalid number of instructions");

    // strongly depends on stack height
    const directCpiStackHeight = followingInstructions[0].stackHeight;
    invariant(directCpiStackHeight !== null, "Stack height is null");
    invariant(directCpiStackHeight >= 2, "Invalid stack height");

    const directCpiInstructions: Instruction[] = [];
    for (let i = 0; i < followingInstructions.length; i++) {
      const ix = followingInstructions[i];
      const stackHeight = ix.stackHeight ?? 1; // top level is 1
      if (stackHeight > directCpiStackHeight) continue; // indirect CPI
      if (stackHeight < directCpiStackHeight) break; // end of direct CPI
      directCpiInstructions.push(ix);
    }

    const transfers: TransferAmountWithTransferFeeConfigAndAccounts[] = [];
    let transferFeeConfig = null;
    for (let i = 0; i < directCpiInstructions.length; i++) {
      const ix = directCpiInstructions[i];
      switch (ix.programId) {
        case MEMO_PROGRAM_ID_STRING:
          const memo = this.textDecoder.decode(bs58.decode(ix.dataBase58));
          // memo must be TransferConfig memo or MemoTransfer memo
          invariant(memo.startsWith(TRANSFER_FEE_CONFIG_MEMO_PREFIX) || memo.startsWith(MEMO_TRANSFER_MEMO_PREFIX), "Invalid memo");

          if (memo.startsWith(TRANSFER_FEE_CONFIG_MEMO_PREFIX)) {
            const match = memo.match(TRANSFER_FEE_CONFIG_MEMO_REGEX);
            invariant(match, "Invalid TransferFeeConfig memo format");

            const basisPoints = parseInt(match[1]);
            const maximumFee = BigInt(match[2]);
            transferFeeConfig = { basisPoints, maximumFee };
          }
          break;
        case TOKEN_PROGRAM_ID_STRING:
        case TOKEN_2022_PROGRAM_ID_STRING:
          const amount = this.decodeTransferCheckedInstruction(ix);
          const source = ix.accounts[0];
          const destination = ix.accounts[2];
          transfers.push({ amount, transferFeeConfig, source, destination });
          transferFeeConfig = null;
          break;
        default:
          invariant(false, "Invalid program id");
      }
    }

    invariant(transfers.length === expectedTransfers, `Invalid number of transfers: ${transfers.length}`);
    return transfers;
  }

  private static decodeSwapInstruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmount[]): DecodedSwapInstruction {
    invariant(ix.name === "swap", "Invalid instruction name");
    invariant(accounts.length >= 11, "Invalid accounts");
    return {
      name: "swap",
      data: {
        amount: ix.data["amount"],
        otherAmountThreshold: ix.data["otherAmountThreshold"],
        sqrtPriceLimit: ix.data["sqrtPriceLimit"],
        amountSpecifiedIsInput: ix.data["amountSpecifiedIsInput"],
        aToB: ix.data["aToB"],
      },
      accounts: {
        tokenProgram: accounts[0],
        tokenAuthority: accounts[1],
        whirlpool: accounts[2],
        tokenOwnerAccountA: accounts[3],
        tokenVaultA: accounts[4],
        tokenOwnerAccountB: accounts[5],
        tokenVaultB: accounts[6],
        tickArray0: accounts[7],
        tickArray1: accounts[8],
        tickArray2: accounts[9],
        oracle: accounts[10],
      },
      transfers,
    };
  }

  private static decodeTwoHopSwapInstruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmount[]): DecodedTwoHopSwapInstruction {
    invariant(ix.name === "twoHopSwap", "Invalid instruction name");
    invariant(accounts.length >= 20, "Invalid accounts");
    return {
      name: "twoHopSwap",
      data: {
        amount: ix.data["amount"],
        otherAmountThreshold: ix.data["otherAmountThreshold"],
        amountSpecifiedIsInput: ix.data["amountSpecifiedIsInput"],
        aToBOne: ix.data["aToBOne"],
        aToBTwo: ix.data["aToBTwo"],
        sqrtPriceLimitOne: ix.data["sqrtPriceLimitOne"],
        sqrtPriceLimitTwo: ix.data["sqrtPriceLimitTwo"],
      },
      accounts: {
        tokenProgram: accounts[0],
        tokenAuthority: accounts[1],
        whirlpoolOne: accounts[2],
        whirlpoolTwo: accounts[3],
        tokenOwnerAccountOneA: accounts[4],
        tokenVaultOneA: accounts[5],
        tokenOwnerAccountOneB: accounts[6],
        tokenVaultOneB: accounts[7],
        tokenOwnerAccountTwoA: accounts[8],
        tokenVaultTwoA: accounts[9],
        tokenOwnerAccountTwoB: accounts[10],
        tokenVaultTwoB: accounts[11],
        tickArrayOne0: accounts[12],
        tickArrayOne1: accounts[13],
        tickArrayOne2: accounts[14],
        tickArrayTwo0: accounts[15],
        tickArrayTwo1: accounts[16],
        tickArrayTwo2: accounts[17],
        oracleOne: accounts[18],
        oracleTwo: accounts[19],
      },
      transfers,
    };
  }

  private static decodeOpenPositionInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedOpenPositionInstruction {
    invariant(ix.name === "openPosition", "Invalid instruction name");
    invariant(accounts.length >= 10, "Invalid accounts");
    return {
      name: "openPosition",
      data: {
        tickLowerIndex: ix.data["tickLowerIndex"],
        tickUpperIndex: ix.data["tickUpperIndex"],
      },
      accounts: {
        funder: accounts[0],
        owner: accounts[1],
        position: accounts[2],
        positionMint: accounts[3],
        positionTokenAccount: accounts[4],
        whirlpool: accounts[5],
        tokenProgram: accounts[6],
        systemProgram: accounts[7],
        rent: accounts[8],
        associatedTokenProgram: accounts[9],
      },
    };
  }

  private static decodeOpenPositionWithMetadataInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedOpenPositionWithMetadataInstruction {
    invariant(ix.name === "openPositionWithMetadata", "Invalid instruction name");
    invariant(accounts.length >= 13, "Invalid accounts");
    return {
      name: "openPositionWithMetadata",
      data: {
        tickLowerIndex: ix.data["tickLowerIndex"],
        tickUpperIndex: ix.data["tickUpperIndex"],
      },
      accounts: {
        funder: accounts[0],
        owner: accounts[1],
        position: accounts[2],
        positionMint: accounts[3],
        positionMetadataAccount: accounts[4],
        positionTokenAccount: accounts[5],
        whirlpool: accounts[6],
        tokenProgram: accounts[7],
        systemProgram: accounts[8],
        rent: accounts[9],
        associatedTokenProgram: accounts[10],
        metadataProgram: accounts[11],
        metadataUpdateAuth: accounts[12],
      },
    };
  }

  private static decodeIncreaseLiquidityInstruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmount[]): DecodedIncreaseLiquidityInstruction {
    invariant(ix.name === "increaseLiquidity", "Invalid instruction name");
    invariant(accounts.length >= 11, "Invalid accounts");
    return {
      name: "increaseLiquidity",
      data: {
        liquidityAmount: ix.data["liquidityAmount"],
        tokenMaxA: ix.data["tokenMaxA"],
        tokenMaxB: ix.data["tokenMaxB"],
      },
      accounts: {
        whirlpool: accounts[0],
        tokenProgram: accounts[1],
        positionAuthority: accounts[2],
        position: accounts[3],
        positionTokenAccount: accounts[4],
        tokenOwnerAccountA: accounts[5],
        tokenOwnerAccountB: accounts[6],
        tokenVaultA: accounts[7],
        tokenVaultB: accounts[8],
        tickArrayLower: accounts[9],
        tickArrayUpper: accounts[10],
      },
      transfers,
    };
  }

  private static decodeDecreaseLiquidityInstruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmount[]): DecodedDecreaseLiquidityInstruction {
    invariant(ix.name === "decreaseLiquidity", "Invalid instruction name");
    invariant(accounts.length >= 11, "Invalid accounts");
    return {
      name: "decreaseLiquidity",
      data: {
        liquidityAmount: ix.data["liquidityAmount"],
        tokenMinA: ix.data["tokenMinA"],
        tokenMinB: ix.data["tokenMinB"],
      },
      accounts: {
        whirlpool: accounts[0],
        tokenProgram: accounts[1],
        positionAuthority: accounts[2],
        position: accounts[3],
        positionTokenAccount: accounts[4],
        tokenOwnerAccountA: accounts[5],
        tokenOwnerAccountB: accounts[6],
        tokenVaultA: accounts[7],
        tokenVaultB: accounts[8],
        tickArrayLower: accounts[9],
        tickArrayUpper: accounts[10],
      },
      transfers,
    };
  }

  private static decodeUpdateFeesAndRewardsInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedUpdateFeesAndRewardsInstruction {
    invariant(ix.name === "updateFeesAndRewards", "Invalid instruction name");
    invariant(accounts.length >= 4, "Invalid accounts");
    return {
      name: "updateFeesAndRewards",
      data: {},
      accounts: {
        whirlpool: accounts[0],
        position: accounts[1],
        tickArrayLower: accounts[2],
        tickArrayUpper: accounts[3],
      },
    };
  }

  private static decodeCollectFeesInstruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmount[]): DecodedCollectFeesInstruction {
    invariant(ix.name === "collectFees", "Invalid instruction name");
    invariant(accounts.length >= 9, "Invalid accounts");
    return {
      name: "collectFees",
      data: {},
      accounts: {
        whirlpool: accounts[0],
        positionAuthority: accounts[1],
        position: accounts[2],
        positionTokenAccount: accounts[3],
        tokenOwnerAccountA: accounts[4],
        tokenVaultA: accounts[5],
        tokenOwnerAccountB: accounts[6],
        tokenVaultB: accounts[7],
        tokenProgram: accounts[8],        
      },
      transfers,
    };
  }

  private static decodeCollectRewardInstruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmount[]): DecodedCollectRewardInstruction {
    invariant(ix.name === "collectReward", "Invalid instruction name");
    invariant(accounts.length >= 7, "Invalid accounts");
    return {
      name: "collectReward",
      data: {
        rewardIndex: ix.data["rewardIndex"],
      },
      accounts: {
        whirlpool: accounts[0],
        positionAuthority: accounts[1],
        position: accounts[2],
        positionTokenAccount: accounts[3],
        rewardOwnerAccount: accounts[4],
        rewardVault: accounts[5],
        tokenProgram: accounts[6],
      },
      transfers,
    };
  }

  private static decodeClosePositionInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedClosePositionInstruction {
    invariant(ix.name === "closePosition", "Invalid instruction name");
    invariant(accounts.length >= 6, "Invalid accounts");
    return {
      name: "closePosition",
      data: {},
      accounts: {
        positionAuthority: accounts[0],
        receiver: accounts[1],
        position: accounts[2],
        positionMint: accounts[3],
        positionTokenAccount: accounts[4],
        tokenProgram: accounts[5],
      },
    };
  }

  private static decodeCollectProtocolFeesInstruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmount[]): DecodedCollectProtocolFeesInstruction {
    invariant(ix.name === "collectProtocolFees", "Invalid instruction name");
    invariant(accounts.length >= 8, "Invalid accounts");
    return {
      name: "collectProtocolFees",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpool: accounts[1],
        collectProtocolFeesAuthority: accounts[2],
        tokenVaultA: accounts[3],
        tokenVaultB: accounts[4],
        tokenDestinationA: accounts[5],
        tokenDestinationB: accounts[6],
        tokenProgram: accounts[7],
      },
      transfers,
    };
  }

  private static decodeAdminIncreaseLiquidityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedAdminIncreaseLiquidityInstruction {
    invariant(ix.name === "adminIncreaseLiquidity", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "adminIncreaseLiquidity",
      data: {
        liquidity: ix.data["liquidity"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpool: accounts[1],
        authority: accounts[2],
      },
    };
  }

  private static decodeInitializeConfigInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedInitializeConfigInstruction {
    invariant(ix.name === "initializeConfig", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "initializeConfig",
      data: {
        feeAuthority: ix.data["feeAuthority"].toString(),
        collectProtocolFeesAuthority: ix.data["collectProtocolFeesAuthority"].toString(),
        rewardEmissionsSuperAuthority: ix.data["rewardEmissionsSuperAuthority"].toString(),
        defaultProtocolFeeRate: ix.data["defaultProtocolFeeRate"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        funder: accounts[1],
        systemProgram: accounts[2],
      },
    };
  }

  private static decodeInitializeFeeTierInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedInitializeFeeTierInstruction {
    invariant(ix.name === "initializeFeeTier", "Invalid instruction name");
    invariant(accounts.length >= 5, "Invalid accounts");
    return {
      name: "initializeFeeTier",
      data: {
        tickSpacing: ix.data["tickSpacing"],
        defaultFeeRate: ix.data["defaultFeeRate"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        feeTier: accounts[1],
        funder: accounts[2],
        feeAuthority: accounts[3],
        systemProgram: accounts[4],
      },
    };
  }

  private static decodeInitializePoolInstruction(ix: AnchorInstruction, accounts: PubkeyString[], decimals: DecimalsMap): DecodedInitializePoolInstruction {
    invariant(ix.name === "initializePool", "Invalid instruction name");
    invariant(accounts.length >= 11, "Invalid accounts");

    const decimalsTokenMintA = decimals[accounts[1]];
    invariant(decimalsTokenMintA !== undefined, "tokenMintA decimals is undefined");
    const decimalsTokenMintB = decimals[accounts[2]];
    invariant(decimalsTokenMintB !== undefined, "tokenMintB decimals is undefined");
    
    return {
      name: "initializePool",
      data: {
        tickSpacing: ix.data["tickSpacing"],
        initialSqrtPrice: ix.data["initialSqrtPrice"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        tokenMintA: accounts[1],
        tokenMintB: accounts[2],
        funder: accounts[3],
        whirlpool: accounts[4],
        tokenVaultA: accounts[5],
        tokenVaultB: accounts[6],
        feeTier: accounts[7],
        tokenProgram: accounts[8],
        systemProgram: accounts[9],
        rent: accounts[10],
      },
      decimals: {
        tokenMintA: decimalsTokenMintA,
        tokenMintB: decimalsTokenMintB,
      },
    };
  }

  private static decodeInitializePositionBundleInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedInitializePositionBundleInstruction {
    invariant(ix.name === "initializePositionBundle", "Invalid instruction name");
    invariant(accounts.length >= 9, "Invalid accounts");
    return {
      name: "initializePositionBundle",
      data: {},
      accounts: {
        positionBundle: accounts[0],
        positionBundleMint: accounts[1],
        positionBundleTokenAccount: accounts[2],
        positionBundleOwner: accounts[3],
        funder: accounts[4],
        tokenProgram: accounts[5],
        systemProgram: accounts[6],
        rent: accounts[7],
        associatedTokenProgram: accounts[8],
      },
    };
  }

  private static decodeInitializePositionBundleWithMetadataInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedInitializePositionBundleWithMetadataInstruction {
    invariant(ix.name === "initializePositionBundleWithMetadata", "Invalid instruction name");
    invariant(accounts.length >= 12, "Invalid accounts");
    return {
      name: "initializePositionBundleWithMetadata",
      data: {},
      accounts: {
        positionBundle: accounts[0],
        positionBundleMint: accounts[1],
        positionBundleMetadata: accounts[2],
        positionBundleTokenAccount: accounts[3],
        positionBundleOwner: accounts[4],
        funder: accounts[5],
        metadataUpdateAuth: accounts[6],
        tokenProgram: accounts[7],
        systemProgram: accounts[8],
        rent: accounts[9],
        associatedTokenProgram: accounts[10],
        metadataProgram: accounts[11],
      },
    };
  }

  private static decodeInitializeRewardInstruction(ix: AnchorInstruction, accounts: PubkeyString[], decimals: DecimalsMap): DecodedInitializeRewardInstruction {
    invariant(ix.name === "initializeReward", "Invalid instruction name");
    invariant(accounts.length >= 8, "Invalid accounts");

    const decimalsRewardMint = decimals[accounts[3]];
    invariant(decimalsRewardMint !== undefined, "rewardMint decimals is undefined");

    return {
      name: "initializeReward",
      data: {
        rewardIndex: ix.data["rewardIndex"],
      },
      accounts: {
        rewardAuthority: accounts[0],
        funder: accounts[1],
        whirlpool: accounts[2],
        rewardMint: accounts[3],
        rewardVault: accounts[4],
        tokenProgram: accounts[5],
        systemProgram: accounts[6],
        rent: accounts[7],
      },
      decimals: {
        rewardMint: decimalsRewardMint,
      },
    };
  }

  private static decodeInitializeTickArrayInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedInitializeTickArrayInstruction {
    invariant(ix.name === "initializeTickArray", "Invalid instruction name");
    invariant(accounts.length >= 4, "Invalid accounts");
    return {
      name: "initializeTickArray",
      data: {
        startTickIndex: ix.data["startTickIndex"],
      },
      accounts: {
        whirlpool: accounts[0],
        funder: accounts[1],
        tickArray: accounts[2],
        systemProgram: accounts[3],
      },
    };
  }

  private static decodeDeletePositionBundleInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedDeletePositionBundleInstruction {
    invariant(ix.name === "deletePositionBundle", "Invalid instruction name");
    invariant(accounts.length >= 6, "Invalid accounts");
    return {
      name: "deletePositionBundle",
      data: {},
      accounts: {
        positionBundle: accounts[0],
        positionBundleMint: accounts[1],
        positionBundleTokenAccount: accounts[2],
        positionBundleOwner: accounts[3],
        receiver: accounts[4],
        tokenProgram: accounts[5],
      },
    };
  }

  private static decodeOpenBundledPositionInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedOpenBundledPositionInstruction {
    invariant(ix.name === "openBundledPosition", "Invalid instruction name");
    invariant(accounts.length >= 8, "Invalid accounts");
    return {
      name: "openBundledPosition",
      data: {
        bundleIndex: ix.data["bundleIndex"],
        tickLowerIndex: ix.data["tickLowerIndex"],
        tickUpperIndex: ix.data["tickUpperIndex"],
      },
      accounts: {
        bundledPosition: accounts[0],
        positionBundle: accounts[1],
        positionBundleTokenAccount: accounts[2],
        positionBundleAuthority: accounts[3],
        whirlpool: accounts[4],
        funder: accounts[5],
        systemProgram: accounts[6],
        rent: accounts[7],
      },
    };
  }

  private static decodeCloseBundledPositionInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedCloseBundledPositionInstruction {
    invariant(ix.name === "closeBundledPosition", "Invalid instruction name");
    invariant(accounts.length >= 5, "Invalid accounts");
    return {
      name: "closeBundledPosition",
      data: {
        bundleIndex: ix.data["bundleIndex"],
      },
      accounts: {
        bundledPosition: accounts[0],
        positionBundle: accounts[1],
        positionBundleTokenAccount: accounts[2],
        positionBundleAuthority: accounts[3],
        receiver: accounts[4],
      },
    };
  }

  private static decodeSetCollectProtocolFeesAuthorityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetCollectProtocolFeesAuthorityInstruction {
    invariant(ix.name === "setCollectProtocolFeesAuthority", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setCollectProtocolFeesAuthority",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        collectProtocolFeesAuthority: accounts[1],
        newCollectProtocolFeesAuthority: accounts[2],
      },
    };
  }

  private static decodeSetDefaultFeeRateInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetDefaultFeeRateInstruction {
    invariant(ix.name === "setDefaultFeeRate", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setDefaultFeeRate",
      data: {
        defaultFeeRate: ix.data["defaultFeeRate"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        feeTier: accounts[1],
        feeAuthority: accounts[2],
      },
    };
  }

  private static decodeSetDefaultProtocolFeeRateInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetDefaultProtocolFeeRateInstruction {
    invariant(ix.name === "setDefaultProtocolFeeRate", "Invalid instruction name");
    invariant(accounts.length >= 2, "Invalid accounts");
    return {
      name: "setDefaultProtocolFeeRate",
      data: {
        defaultProtocolFeeRate: ix.data["defaultProtocolFeeRate"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        feeAuthority: accounts[1],
      },
    };
  }

  private static decodeSetFeeAuthorityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetFeeAuthorityInstruction {
    invariant(ix.name === "setFeeAuthority", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setFeeAuthority",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        feeAuthority: accounts[1],
        newFeeAuthority: accounts[2],
      },
    };
  }

  private static decodeSetFeeRateInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetFeeRateInstruction {
    invariant(ix.name === "setFeeRate", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setFeeRate",
      data: {
        feeRate: ix.data["feeRate"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpool: accounts[1],
        feeAuthority: accounts[2],
      },
    };
  }

  private static decodeSetProtocolFeeRateInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetProtocolFeeRateInstruction {
    invariant(ix.name === "setProtocolFeeRate", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setProtocolFeeRate",
      data: {
        protocolFeeRate: ix.data["protocolFeeRate"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpool: accounts[1],
        feeAuthority: accounts[2],
      },
    };
  }

  private static decodeSetRewardAuthorityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetRewardAuthorityInstruction {
    invariant(ix.name === "setRewardAuthority", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setRewardAuthority",
      data: {
        rewardIndex: ix.data["rewardIndex"],
      },
      accounts: {
        whirlpool: accounts[0],
        rewardAuthority: accounts[1],
        newRewardAuthority: accounts[2],
      },
    };
  }

  private static decodeSetRewardAuthorityBySuperAuthorityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetRewardAuthorityBySuperAuthorityInstruction {
    invariant(ix.name === "setRewardAuthorityBySuperAuthority", "Invalid instruction name");
    invariant(accounts.length >= 4, "Invalid accounts");
    return {
      name: "setRewardAuthorityBySuperAuthority",
      data: {
        rewardIndex: ix.data["rewardIndex"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpool: accounts[1],
        rewardEmissionsSuperAuthority: accounts[2],
        newRewardAuthority: accounts[3],
      },
    };
  }

  private static decodeSetRewardEmissionsInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetRewardEmissionsInstruction {
    invariant(ix.name === "setRewardEmissions", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setRewardEmissions",
      data: {
        rewardIndex: ix.data["rewardIndex"],
        emissionsPerSecondX64: ix.data["emissionsPerSecondX64"],
      },
      accounts: {
        whirlpool: accounts[0],
        rewardAuthority: accounts[1],
        rewardVault: accounts[2],
      },
    };
  }

  private static decodeSetRewardEmissionsSuperAuthorityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetRewardEmissionsSuperAuthorityInstruction {
    invariant(ix.name === "setRewardEmissionsSuperAuthority", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setRewardEmissionsSuperAuthority",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        rewardEmissionsSuperAuthority: accounts[1],
        newRewardEmissionsSuperAuthority: accounts[2],
      },
    };
  }

  private static decodeCollectFeesV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmountWithTransferFeeConfig[]): DecodedCollectFeesV2Instruction {
    invariant(ix.name === "collectFeesV2", "Invalid instruction name");
    invariant(accounts.length >= 13, "Invalid accounts");
    return {
      name: "collectFeesV2",
      data: {
        remainingAccountsInfo: this.decodeRemainingAccountsInfo(ix.data["remainingAccountsInfo"]),
      },
      accounts: {
        whirlpool: accounts[0],
        positionAuthority: accounts[1],
        position: accounts[2],
        positionTokenAccount: accounts[3],
        tokenMintA: accounts[4],
        tokenMintB: accounts[5],
        tokenOwnerAccountA: accounts[6],
        tokenVaultA: accounts[7],
        tokenOwnerAccountB: accounts[8],
        tokenVaultB: accounts[9],
        tokenProgramA: accounts[10],
        tokenProgramB: accounts[11],
        memoProgram: accounts[12],        
      },
      remainingAccounts: accounts.slice(13),
      transfers,
    };
  }

  private static decodeCollectProtocolFeesV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmountWithTransferFeeConfig[]): DecodedCollectProtocolFeesV2Instruction {
    invariant(ix.name === "collectProtocolFeesV2", "Invalid instruction name");
    invariant(accounts.length >= 12, "Invalid accounts");
    return {
      name: "collectProtocolFeesV2",
      data: {
        remainingAccountsInfo: this.decodeRemainingAccountsInfo(ix.data["remainingAccountsInfo"]),
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpool: accounts[1],
        collectProtocolFeesAuthority: accounts[2],
        tokenMintA: accounts[3],
        tokenMintB: accounts[4],
        tokenVaultA: accounts[5],
        tokenVaultB: accounts[6],
        tokenDestinationA: accounts[7],
        tokenDestinationB: accounts[8],
        tokenProgramA: accounts[9],
        tokenProgramB: accounts[10],
        memoProgram: accounts[11],
      },
      remainingAccounts: accounts.slice(12),
      transfers,
    };
  }

  private static decodeCollectRewardV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmountWithTransferFeeConfig[]): DecodedCollectRewardV2Instruction {
    invariant(ix.name === "collectRewardV2", "Invalid instruction name");
    invariant(accounts.length >= 9, "Invalid accounts");
    return {
      name: "collectRewardV2",
      data: {
        rewardIndex: ix.data["rewardIndex"],
        remainingAccountsInfo: this.decodeRemainingAccountsInfo(ix.data["remainingAccountsInfo"]),
      },
      accounts: {
        whirlpool: accounts[0],
        positionAuthority: accounts[1],
        position: accounts[2],
        positionTokenAccount: accounts[3],
        rewardOwnerAccount: accounts[4],
        rewardMint: accounts[5],
        rewardVault: accounts[6],
        rewardTokenProgram: accounts[7],
        memoProgram: accounts[8],
      },
      remainingAccounts: accounts.slice(9),
      transfers,
    };
  }

  private static decodeDecreaseLiquidityV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmountWithTransferFeeConfig[]): DecodedDecreaseLiquidityV2Instruction {
    invariant(ix.name === "decreaseLiquidityV2", "Invalid instruction name");
    invariant(accounts.length >= 15, "Invalid accounts");
    return {
      name: "decreaseLiquidityV2",
      data: {
        liquidityAmount: ix.data["liquidityAmount"],
        tokenMinA: ix.data["tokenMinA"],
        tokenMinB: ix.data["tokenMinB"],
        remainingAccountsInfo: this.decodeRemainingAccountsInfo(ix.data["remainingAccountsInfo"]),
      },
      accounts: {
        whirlpool: accounts[0],
        tokenProgramA: accounts[1],
        tokenProgramB: accounts[2],
        memoProgram: accounts[3],
        positionAuthority: accounts[4],
        position: accounts[5],
        positionTokenAccount: accounts[6],
        tokenMintA: accounts[7],
        tokenMintB: accounts[8],
        tokenOwnerAccountA: accounts[9],
        tokenOwnerAccountB: accounts[10],
        tokenVaultA: accounts[11],
        tokenVaultB: accounts[12],
        tickArrayLower: accounts[13],
        tickArrayUpper: accounts[14],
      },
      remainingAccounts: accounts.slice(15),
      transfers,
    };
  }

  private static decodeIncreaseLiquidityV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmountWithTransferFeeConfig[]): DecodedIncreaseLiquidityV2Instruction {
    invariant(ix.name === "increaseLiquidityV2", "Invalid instruction name");
    invariant(accounts.length >= 15, "Invalid accounts");
    return {
      name: "increaseLiquidityV2",
      data: {
        liquidityAmount: ix.data["liquidityAmount"],
        tokenMaxA: ix.data["tokenMaxA"],
        tokenMaxB: ix.data["tokenMaxB"],
        remainingAccountsInfo: this.decodeRemainingAccountsInfo(ix.data["remainingAccountsInfo"]),
      },
      accounts: {
        whirlpool: accounts[0],
        tokenProgramA: accounts[1],
        tokenProgramB: accounts[2],
        memoProgram: accounts[3],
        positionAuthority: accounts[4],
        position: accounts[5],
        positionTokenAccount: accounts[6],
        tokenMintA: accounts[7],
        tokenMintB: accounts[8],
        tokenOwnerAccountA: accounts[9],
        tokenOwnerAccountB: accounts[10],
        tokenVaultA: accounts[11],
        tokenVaultB: accounts[12],
        tickArrayLower: accounts[13],
        tickArrayUpper: accounts[14],
      },
      remainingAccounts: accounts.slice(15),
      transfers,
    };
  }

  private static decodeInitializePoolV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[], decimals: DecimalsMap): DecodedInitializePoolV2Instruction {
    invariant(ix.name === "initializePoolV2", "Invalid instruction name");
    invariant(accounts.length >= 14, "Invalid accounts");

    const decimalsTokenMintA = decimals[accounts[1]];
    invariant(decimalsTokenMintA !== undefined, "tokenMintA decimals is undefined");
    const decimalsTokenMintB = decimals[accounts[2]];
    invariant(decimalsTokenMintB !== undefined, "tokenMintB decimals is undefined");

    return {
      name: "initializePoolV2",
      data: {
        tickSpacing: ix.data["tickSpacing"],
        initialSqrtPrice: ix.data["initialSqrtPrice"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        tokenMintA: accounts[1],
        tokenMintB: accounts[2],
        tokenBadgeA: accounts[3],
        tokenBadgeB: accounts[4],
        funder: accounts[5],
        whirlpool: accounts[6],
        tokenVaultA: accounts[7],
        tokenVaultB: accounts[8],
        feeTier: accounts[9],
        tokenProgramA: accounts[10],
        tokenProgramB: accounts[11],
        systemProgram: accounts[12],
        rent: accounts[13],
      },
      decimals: {
        tokenMintA: decimalsTokenMintA,
        tokenMintB: decimalsTokenMintB,
      },
    };
  }

  private static decodeInitializeRewardV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[], decimals: DecimalsMap): DecodedInitializeRewardV2Instruction {
    invariant(ix.name === "initializeRewardV2", "Invalid instruction name");
    invariant(accounts.length >= 9, "Invalid accounts");

    const decimalsRewardMint = decimals[accounts[3]];
    invariant(decimalsRewardMint !== undefined, "rewardMint decimals is undefined");

    return {
      name: "initializeRewardV2",
      data: {
        rewardIndex: ix.data["rewardIndex"],
      },
      accounts: {
        rewardAuthority: accounts[0],
        funder: accounts[1],
        whirlpool: accounts[2],
        rewardMint: accounts[3],
        rewardTokenBadge: accounts[4],
        rewardVault: accounts[5],
        rewardTokenProgram: accounts[6],
        systemProgram: accounts[7],
        rent: accounts[8],
      },
      decimals: {
        rewardMint: decimalsRewardMint,
      },
    };
  }

  private static decodeSetRewardEmissionsV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetRewardEmissionsV2Instruction {
    invariant(ix.name === "setRewardEmissionsV2", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setRewardEmissionsV2",
      data: {
        rewardIndex: ix.data["rewardIndex"],
        emissionsPerSecondX64: ix.data["emissionsPerSecondX64"],
      },
      accounts: {
        whirlpool: accounts[0],
        rewardAuthority: accounts[1],
        rewardVault: accounts[2],
      },
    };
  }

  private static decodeSwapV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmountWithTransferFeeConfig[]): DecodedSwapV2Instruction {
    invariant(ix.name === "swapV2", "Invalid instruction name");
    invariant(accounts.length >= 15, "Invalid accounts");
    return {
      name: "swapV2",
      data: {
        amount: ix.data["amount"],
        otherAmountThreshold: ix.data["otherAmountThreshold"],
        sqrtPriceLimit: ix.data["sqrtPriceLimit"],
        amountSpecifiedIsInput: ix.data["amountSpecifiedIsInput"],
        aToB: ix.data["aToB"],
        remainingAccountsInfo: this.decodeRemainingAccountsInfo(ix.data["remainingAccountsInfo"]),
      },
      accounts: {
        tokenProgramA: accounts[0],
        tokenProgramB: accounts[1],
        memoProgram: accounts[2],
        tokenAuthority: accounts[3],
        whirlpool: accounts[4],
        tokenMintA: accounts[5],
        tokenMintB: accounts[6],
        tokenOwnerAccountA: accounts[7],
        tokenVaultA: accounts[8],
        tokenOwnerAccountB: accounts[9],
        tokenVaultB: accounts[10],
        tickArray0: accounts[11],
        tickArray1: accounts[12],
        tickArray2: accounts[13],
        oracle: accounts[14],
      },
      remainingAccounts: accounts.slice(15),
      transfers,
    };
  }

  private static decodeTwoHopSwapV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmountWithTransferFeeConfig[]): DecodedTwoHopSwapV2Instruction {
    invariant(ix.name === "twoHopSwapV2", "Invalid instruction name");
    invariant(accounts.length >= 24, "Invalid accounts");
    return {
      name: "twoHopSwapV2",
      data: {
        amount: ix.data["amount"],
        otherAmountThreshold: ix.data["otherAmountThreshold"],
        amountSpecifiedIsInput: ix.data["amountSpecifiedIsInput"],
        aToBOne: ix.data["aToBOne"],
        aToBTwo: ix.data["aToBTwo"],
        sqrtPriceLimitOne: ix.data["sqrtPriceLimitOne"],
        sqrtPriceLimitTwo: ix.data["sqrtPriceLimitTwo"],
        remainingAccountsInfo: this.decodeRemainingAccountsInfo(ix.data["remainingAccountsInfo"]),
      },
      accounts: {
        whirlpoolOne: accounts[0],
        whirlpoolTwo: accounts[1],
        tokenMintInput: accounts[2],
        tokenMintIntermediate: accounts[3],
        tokenMintOutput: accounts[4],
        tokenProgramInput: accounts[5],
        tokenProgramIntermediate: accounts[6],
        tokenProgramOutput: accounts[7],
        tokenOwnerAccountInput: accounts[8],
        tokenVaultOneInput: accounts[9],
        tokenVaultOneIntermediate: accounts[10],
        tokenVaultTwoIntermediate: accounts[11],
        tokenVaultTwoOutput: accounts[12],
        tokenOwnerAccountOutput: accounts[13],
        tokenAuthority: accounts[14],
        tickArrayOne0: accounts[15],
        tickArrayOne1: accounts[16],
        tickArrayOne2: accounts[17],
        tickArrayTwo0: accounts[18],
        tickArrayTwo1: accounts[19],
        tickArrayTwo2: accounts[20],
        oracleOne: accounts[21],
        oracleTwo: accounts[22],
        memoProgram: accounts[23],
      },
      remainingAccounts: accounts.slice(24),
      transfers,
    };
  }

  private static decodeInitializeConfigExtensionInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedInitializeConfigExtensionInstruction {
    invariant(ix.name === "initializeConfigExtension", "Invalid instruction name");
    invariant(accounts.length >= 5, "Invalid accounts");
    return {
      name: "initializeConfigExtension",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpoolsConfigExtension: accounts[1],
        funder: accounts[2],
        feeAuthority: accounts[3],
        systemProgram: accounts[4],
      },
    };
  }

  private static decodeInitializeTokenBadgeInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedInitializeTokenBadgeInstruction {
    invariant(ix.name === "initializeTokenBadge", "Invalid instruction name");
    invariant(accounts.length >= 7, "Invalid accounts");
    return {
      name: "initializeTokenBadge",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpoolsConfigExtension: accounts[1],
        tokenBadgeAuthority: accounts[2],
        tokenMint: accounts[3],
        tokenBadge: accounts[4],
        funder: accounts[5],
        systemProgram: accounts[6],
      },
    };
  }

  private static decodeDeleteTokenBadgeInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedDeleteTokenBadgeInstruction {
    invariant(ix.name === "deleteTokenBadge", "Invalid instruction name");
    invariant(accounts.length >= 6, "Invalid accounts");
    return {
      name: "deleteTokenBadge",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpoolsConfigExtension: accounts[1],
        tokenBadgeAuthority: accounts[2],
        tokenMint: accounts[3],
        tokenBadge: accounts[4],
        receiver: accounts[5],
      },
    };
  }

  private static decodeSetConfigExtensionAuthorityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetConfigExtensionAuthorityInstruction {
    invariant(ix.name === "setConfigExtensionAuthority", "Invalid instruction name");
    invariant(accounts.length >= 4, "Invalid accounts");
    return {
      name: "setConfigExtensionAuthority",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpoolsConfigExtension: accounts[1],
        configExtensionAuthority: accounts[2],
        newConfigExtensionAuthority: accounts[3],
      },
    };
  }

  private static decodeSetTokenBadgeAuthorityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetTokenBadgeAuthorityInstruction {
    invariant(ix.name === "setTokenBadgeAuthority", "Invalid instruction name");
    invariant(accounts.length >= 4, "Invalid accounts");
    return {
      name: "setTokenBadgeAuthority",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpoolsConfigExtension: accounts[1],
        configExtensionAuthority: accounts[2],
        newTokenBadgeAuthority: accounts[3],
      },
    };
  }

  private static decodeOpenPositionWithTokenExtensionsInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedOpenPositionWithTokenExtensionsInstruction {
    invariant(ix.name === "openPositionWithTokenExtensions", "Invalid instruction name");
    invariant(accounts.length >= 10, "Invalid accounts");
    return {
      name: "openPositionWithTokenExtensions",
      data: {
        tickLowerIndex: ix.data["tickLowerIndex"],
        tickUpperIndex: ix.data["tickUpperIndex"],
        withTokenMetadataExtension: ix.data["withTokenMetadataExtension"],
      },
      accounts: {
        funder: accounts[0],
        owner: accounts[1],
        position: accounts[2],
        positionMint: accounts[3],
        positionTokenAccount: accounts[4],
        whirlpool: accounts[5],
        token2022Program: accounts[6],
        systemProgram: accounts[7],
        associatedTokenProgram: accounts[8],
        metadataUpdateAuth: accounts[9],
      },
    };
  }

  private static decodeClosePositionWithTokenExtensionsInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedClosePositionWithTokenExtensionsInstruction {
    invariant(ix.name === "closePositionWithTokenExtensions", "Invalid instruction name");
    invariant(accounts.length >= 6, "Invalid accounts");
    return {
      name: "closePositionWithTokenExtensions",
      data: {},
      accounts: {
        positionAuthority: accounts[0],
        receiver: accounts[1],
        position: accounts[2],
        positionMint: accounts[3],
        positionTokenAccount: accounts[4],
        token2022Program: accounts[5],
      },
    };
  }

  private static decodeLockPositionInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedLockPositionInstruction {
    invariant(ix.name === "lockPosition", "Invalid instruction name");
    invariant(accounts.length >= 9, "Invalid accounts");
    return {
      name: "lockPosition",
      data: {
        lockType: this.decodeLockType(ix.data["lockType"]),
      },
      accounts: {
        funder: accounts[0],
        positionAuthority: accounts[1],
        position: accounts[2],
        positionMint: accounts[3],
        positionTokenAccount: accounts[4],
        lockConfig: accounts[5],
        whirlpool: accounts[6],
        token2022Program: accounts[7],
        systemProgram: accounts[8],
      },
      auxiliaries: {
        positionTokenAccountOwner: PUBKEY_STRING_PLACEHOLDER, // will be resolved later
      },
    };
  }

  private static decodeResetPositionRangeInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedResetPositionRangeInstruction {
    invariant(ix.name === "resetPositionRange", "Invalid instruction name");
    invariant(accounts.length >= 6, "Invalid accounts");
    return {
      name: "resetPositionRange",
      data: {
        newTickLowerIndex: ix.data["newTickLowerIndex"],
        newTickUpperIndex: ix.data["newTickUpperIndex"],
      },
      accounts: {
        funder: accounts[0],
        positionAuthority: accounts[1],
        whirlpool: accounts[2],
        position: accounts[3],
        positionTokenAccount: accounts[4],
        systemProgram: accounts[5],
      },
    };
  }

  private static decodeTransferLockedPositionInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedTransferLockedPositionInstruction {
    invariant(ix.name === "transferLockedPosition", "Invalid instruction name");
    invariant(accounts.length >= 8, "Invalid accounts");
    return {
      name: "transferLockedPosition",
      data: {},
      accounts: {
        positionAuthority: accounts[0],
        receiver: accounts[1],
        position: accounts[2],
        positionMint: accounts[3],
        positionTokenAccount: accounts[4],
        destinationTokenAccount: accounts[5],
        lockConfig: accounts[6],
        token2022Program: accounts[7],
      },
      auxiliaries: {
        destinationTokenAccountOwner: PUBKEY_STRING_PLACEHOLDER, // will be resolved later
      },
    };
  }

  private static decodeInitializeAdaptiveFeeTierInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedInitializeAdaptiveFeeTierInstruction {
    invariant(ix.name === "initializeAdaptiveFeeTier", "Invalid instruction name");
    invariant(accounts.length >= 5, "Invalid accounts");
    return {
      name: "initializeAdaptiveFeeTier",
      data: {
        feeTierIndex: ix.data["feeTierIndex"],
        tickSpacing: ix.data["tickSpacing"],
        initializePoolAuthority: ix.data["initializePoolAuthority"].toString(),
        delegatedFeeAuthority: ix.data["delegatedFeeAuthority"].toString(),
        defaultBaseFeeRate: ix.data["defaultBaseFeeRate"],
        filterPeriod: ix.data["filterPeriod"],
        decayPeriod: ix.data["decayPeriod"],
        reductionFactor: ix.data["reductionFactor"],
        adaptiveFeeControlFactor: ix.data["adaptiveFeeControlFactor"],
        maxVolatilityAccumulator: ix.data["maxVolatilityAccumulator"],
        tickGroupSize: ix.data["tickGroupSize"],
        majorSwapThresholdTicks: ix.data["majorSwapThresholdTicks"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        adaptiveFeeTier: accounts[1],
        funder: accounts[2],
        feeAuthority: accounts[3],
        systemProgram: accounts[4],
      },
    };
  }

  private static decodeInitializePoolWithAdaptiveFeeInstruction(ix: AnchorInstruction, accounts: PubkeyString[], decimals: DecimalsMap): DecodedInitializePoolWithAdaptiveFeeInstruction {
    invariant(ix.name === "initializePoolWithAdaptiveFee", "Invalid instruction name");
    invariant(accounts.length >= 16, "Invalid accounts");

    const decimalsTokenMintA = decimals[accounts[1]];
    invariant(decimalsTokenMintA !== undefined, "tokenMintA decimals is undefined");
    const decimalsTokenMintB = decimals[accounts[2]];
    invariant(decimalsTokenMintB !== undefined, "tokenMintB decimals is undefined");

    return {
      name: "initializePoolWithAdaptiveFee",
      data: {
        initialSqrtPrice: ix.data["initialSqrtPrice"],
        tradeEnableTimestamp: ix.data["tradeEnableTimestamp"] ?? new BN(0),
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        tokenMintA: accounts[1],
        tokenMintB: accounts[2],
        tokenBadgeA: accounts[3],
        tokenBadgeB: accounts[4],
        funder: accounts[5],
        initializePoolAuthority: accounts[6],
        whirlpool: accounts[7],
        oracle: accounts[8],
        tokenVaultA: accounts[9],
        tokenVaultB: accounts[10],
        adaptiveFeeTier: accounts[11],
        tokenProgramA: accounts[12],
        tokenProgramB: accounts[13],
        systemProgram: accounts[14],
        rent: accounts[15],
      },
      decimals: {
        tokenMintA: decimalsTokenMintA,
        tokenMintB: decimalsTokenMintB,
      },
    };
  }

  private static decodeSetDefaultBaseFeeRateInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetDefaultBaseFeeRateInstruction {
    invariant(ix.name === "setDefaultBaseFeeRate", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setDefaultBaseFeeRate",
      data: {
        defaultBaseFeeRate: ix.data["defaultBaseFeeRate"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        adaptiveFeeTier: accounts[1],
        feeAuthority: accounts[2],
      },
    };
  }

  private static decodeSetDelegatedFeeAuthorityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetDelegatedFeeAuthorityInstruction {
    invariant(ix.name === "setDelegatedFeeAuthority", "Invalid instruction name");
    invariant(accounts.length >= 4, "Invalid accounts");
    return {
      name: "setDelegatedFeeAuthority",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        adaptiveFeeTier: accounts[1],
        feeAuthority: accounts[2],
        newDelegatedFeeAuthority: accounts[3],
      },
    };
  }

  private static decodeSetInitializePoolAuthorityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetInitializePoolAuthorityInstruction {
    invariant(ix.name === "setInitializePoolAuthority", "Invalid instruction name");
    invariant(accounts.length >= 4, "Invalid accounts");
    return {
      name: "setInitializePoolAuthority",
      data: {},
      accounts: {
        whirlpoolsConfig: accounts[0],
        adaptiveFeeTier: accounts[1],
        feeAuthority: accounts[2],
        newInitializePoolAuthority: accounts[3],
      },
    };
  }

  private static decodeSetPresetAdaptiveFeeConstantsInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetPresetAdaptiveFeeConstantsInstruction {
    invariant(ix.name === "setPresetAdaptiveFeeConstants", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setPresetAdaptiveFeeConstants",
      data: {
        filterPeriod: ix.data["filterPeriod"],
        decayPeriod: ix.data["decayPeriod"],
        reductionFactor: ix.data["reductionFactor"],
        adaptiveFeeControlFactor: ix.data["adaptiveFeeControlFactor"],
        maxVolatilityAccumulator: ix.data["maxVolatilityAccumulator"],
        tickGroupSize: ix.data["tickGroupSize"],
        majorSwapThresholdTicks: ix.data["majorSwapThresholdTicks"],
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        adaptiveFeeTier: accounts[1],
        feeAuthority: accounts[2],
      },
    };
  }

  private static decodeSetFeeRateByDelegatedFeeAuthorityInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetFeeRateByDelegatedFeeAuthorityInstruction {
    invariant(ix.name === "setFeeRateByDelegatedFeeAuthority", "Invalid instruction name");
    invariant(accounts.length >= 3, "Invalid accounts");
    return {
      name: "setFeeRateByDelegatedFeeAuthority",
      data: {
        feeRate: ix.data["feeRate"],
      },
      accounts: {
        whirlpool: accounts[0],
        adaptiveFeeTier: accounts[1],
        delegatedFeeAuthority: accounts[2],
      },
    };
  }

  private static decodeInitializeDynamicTickArrayInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedInitializeDynamicTickArrayInstruction {
    invariant(ix.name === "initializeDynamicTickArray", "Invalid instruction name");
    invariant(accounts.length >= 4, "Invalid accounts");
    return {
      name: "initializeDynamicTickArray",
      data: {
        startTickIndex: ix.data["startTickIndex"],
        idempotent: ix.data["idempotent"],
      },
      accounts: {
        whirlpool: accounts[0],
        funder: accounts[1],
        tickArray: accounts[2],
        systemProgram: accounts[3],
      },
    };
  }

  private static decodeSetConfigFeatureFlagInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetConfigFeatureFlagInstruction {
    invariant(ix.name === "setConfigFeatureFlag", "Invalid instruction name");
    invariant(accounts.length >= 2, "Invalid accounts");
    return {
      name: "setConfigFeatureFlag",
      data: {
        featureFlag: this.decodeConfigFeatureFlag(ix.data["featureFlag"]),
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        authority: accounts[1],
      },
    };
  }

  private static decodeSetTokenBadgeAttributeInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetTokenBadgeAttributeInstruction {
    invariant(ix.name === "setTokenBadgeAttribute", "Invalid instruction name");
    invariant(accounts.length >= 5, "Invalid accounts");
    return {
      name: "setTokenBadgeAttribute",
      data: {
        attribute: this.decodeTokenBadgeAttribute(ix.data["attribute"]),
      },
      accounts: {
        whirlpoolsConfig: accounts[0],
        whirlpoolsConfigExtension: accounts[1],
        tokenBadgeAuthority: accounts[2],
        tokenMint: accounts[3],
        tokenBadge: accounts[4],
      },
    };
  }

  private static decodeMigrateRepurposeRewardAuthoritySpaceInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedMigrateRepurposeRewardAuthoritySpaceInstruction {
    invariant(ix.name === "migrateRepurposeRewardAuthoritySpace", "Invalid instruction name");
    invariant(accounts.length >= 1, "Invalid accounts");
    return {
      name: "migrateRepurposeRewardAuthoritySpace",
      data: {},
      accounts: {
        whirlpool: accounts[0],
      },
    };
  }

  private static decodeSetAdaptiveFeeConstantsInstruction(ix: AnchorInstruction, accounts: PubkeyString[]): DecodedSetAdaptiveFeeConstantsInstruction {
    invariant(ix.name === "setAdaptiveFeeConstants", "Invalid instruction name");
    invariant(accounts.length >= 4, "Invalid accounts");

    const checkData = (field: string) => {
      invariant(typeof ix.data[field] === "number" || ix.data[field] === null, `Invalid ${field}`);
    }
    checkData("filterPeriod");
    checkData("decayPeriod");
    checkData("reductionFactor");
    checkData("adaptiveFeeControlFactor");
    checkData("maxVolatilityAccumulator");
    checkData("tickGroupSize");
    checkData("majorSwapThresholdTicks");

    return {
      name: "setAdaptiveFeeConstants",
      data: {
        filterPeriod: ix.data["filterPeriod"],
        decayPeriod: ix.data["decayPeriod"],
        reductionFactor: ix.data["reductionFactor"],
        adaptiveFeeControlFactor: ix.data["adaptiveFeeControlFactor"],
        maxVolatilityAccumulator: ix.data["maxVolatilityAccumulator"],
        tickGroupSize: ix.data["tickGroupSize"],
        majorSwapThresholdTicks: ix.data["majorSwapThresholdTicks"],
      },
      accounts: {
        whirlpool: accounts[0],
        whirlpoolsConfig: accounts[1],
        oracle: accounts[2],
        feeAuthority: accounts[3],
      },
    };
  }

  private static decodeRepositionLiquidityV2Instruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmountWithTransferFeeConfigAndAccounts[]): DecodedRepositionLiquidityV2Instruction {
    invariant(ix.name === "repositionLiquidityV2", "Invalid instruction name");
    invariant(accounts.length >= 19, "Invalid accounts");

    const tokenOwnerAccountA = accounts[10];
    const tokenOwnerAccountB = accounts[11];
    const tokenVaultA = accounts[12];
    const tokenVaultB = accounts[13];

    const transferASource = transfers[0].source;
    const transferADestination = transfers[0].destination;
    const transferBSource = transfers[1].source;
    const transferBDestination = transfers[1].destination;

    invariant(transferASource === tokenOwnerAccountA || transferASource === tokenVaultA, "Invalid transfer source for token A");
    invariant(transferADestination === tokenOwnerAccountA || transferADestination === tokenVaultA, "Invalid transfer destination for token A");
    invariant(transferBSource === tokenOwnerAccountB || transferBSource === tokenVaultB, "Invalid transfer source for token B");
    invariant(transferBDestination === tokenOwnerAccountB || transferBDestination === tokenVaultB, "Invalid transfer destination for token B");

    const isTokenATransferFromOwner = transferASource === tokenOwnerAccountA;
    const isTokenBTransferFromOwner = transferBSource === tokenOwnerAccountB;

    return {
      name: "repositionLiquidityV2",
      data: {
        newTickLowerIndex: ix.data["newTickLowerIndex"],
        newTickUpperIndex: ix.data["newTickUpperIndex"],
        method: this.decodeRepositionLiquidityMethod(ix.data["method"]),
        remainingAccountsInfo: this.decodeRemainingAccountsInfo(ix.data["remainingAccountsInfo"]),
      },
      accounts: {
        whirlpool: accounts[0],
        tokenProgramA: accounts[1],
        tokenProgramB: accounts[2],
        memoProgram: accounts[3],
        positionAuthority: accounts[4],
        funder: accounts[5],
        position: accounts[6],
        positionTokenAccount: accounts[7],
        tokenMintA: accounts[8],
        tokenMintB: accounts[9],
        tokenOwnerAccountA: accounts[10],
        tokenOwnerAccountB: accounts[11],
        tokenVaultA: accounts[12],
        tokenVaultB: accounts[13],
        existingTickArrayLower: accounts[14],
        existingTickArrayUpper: accounts[15],
        newTickArrayLower: accounts[16],
        newTickArrayUpper: accounts[17],
        systemProgram: accounts[18],
      },
      remainingAccounts: accounts.slice(19),
      transfers,
      auxiliaries: {
        isTokenATransferFromOwner,
        isTokenBTransferFromOwner,
      }
    };
  }

  private static decodeIncreaseLiquidityByTokenAmountsInstruction(ix: AnchorInstruction, accounts: PubkeyString[], transfers: TransferAmountWithTransferFeeConfig[]): DecodedIncreaseLiquidityByTokenAmountsV2Instruction {
    invariant(ix.name === "increaseLiquidityByTokenAmountsV2", "Invalid instruction name");
    invariant(accounts.length >= 15, "Invalid accounts");
    return {
      name: "increaseLiquidityByTokenAmountsV2",
      data: {
        method: this.decodeIncreaseLiquidityMethod(ix.data["method"]),
        remainingAccountsInfo: this.decodeRemainingAccountsInfo(ix.data["remainingAccountsInfo"]),
      },
      accounts: {
        whirlpool: accounts[0],
        tokenProgramA: accounts[1],
        tokenProgramB: accounts[2],
        memoProgram: accounts[3],
        positionAuthority: accounts[4],
        position: accounts[5],
        positionTokenAccount: accounts[6],
        tokenMintA: accounts[7],
        tokenMintB: accounts[8],
        tokenOwnerAccountA: accounts[9],
        tokenOwnerAccountB: accounts[10],
        tokenVaultA: accounts[11],
        tokenVaultB: accounts[12],
        tickArrayLower: accounts[13],
        tickArrayUpper: accounts[14],
      },
      remainingAccounts: accounts.slice(15),
      transfers,
    };

  }
}
