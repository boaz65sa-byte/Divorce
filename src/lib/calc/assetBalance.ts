import type { AssetItem, DebtItem } from "../types";

export interface AssetBalanceResult {
  totalAssets: number;
  maritalAssets: number;
  excludedAssets: number;
  totalDebts: number;
  sharedDebts: number;
  personalDebts: number;
  netMarital: number;
  sharePerSpouse: number;
}

export function calcAssetBalance(
  assets: AssetItem[],
  debts: DebtItem[],
): AssetBalanceResult {
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const maritalAssets = assets
    .filter((a) => a.acquiredDuringMarriage)
    .reduce((sum, a) => sum + a.value, 0);
  const excludedAssets = totalAssets - maritalAssets;

  const totalDebts = debts.reduce((sum, d) => sum + d.amount, 0);
  const sharedDebts = debts
    .filter((d) => d.isHouseholdDebt)
    .reduce((sum, d) => sum + d.amount, 0);
  const personalDebts = totalDebts - sharedDebts;

  const netMarital = maritalAssets - sharedDebts;
  const sharePerSpouse = netMarital / 2;

  return {
    totalAssets,
    maritalAssets,
    excludedAssets,
    totalDebts,
    sharedDebts,
    personalDebts,
    netMarital,
    sharePerSpouse,
  };
}
