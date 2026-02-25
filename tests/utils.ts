import { BN } from "@coral-xyz/anchor";

export const jsonifyEnum = (enumValue: any): string => {
  // The original toJSON method of BN returns a number in hexadecimal string, which is not suitable for our use case.
  // So we temporarily override the toJSON method of BN to return a decimal string.
  const orgToJSON = BN.prototype.toJSON;
  BN.prototype.toJSON = function() { return this.toString(10); }
  const result = JSON.stringify(enumValue);
  BN.prototype.toJSON = orgToJSON;
  return result;
}
