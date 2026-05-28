"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Input,
  PageHeader,
  Select,
  StatBox,
} from "@/components/ui";
import { calcAssetBalance } from "@/lib/calc/assetBalance";
import { formatCurrency } from "@/lib/calc/childSupport";
import type { AssetItem, DebtItem } from "@/lib/types";

const defaultAssets: AssetItem[] = [
  { id: "1", name: "דירה", value: 1500000, acquiredDuringMarriage: true },
  { id: "2", name: "חסכונות", value: 80000, acquiredDuringMarriage: true },
  { id: "3", name: "ירושה", value: 120000, acquiredDuringMarriage: false },
];

const defaultDebts: DebtItem[] = [
  { id: "1", name: "משכנתא", amount: 600000, isHouseholdDebt: true },
  { id: "2", name: "הלוואה אישית", amount: 30000, isHouseholdDebt: false },
];

export default function AssetsCalculatorPage() {
  const [assets, setAssets] = useState(defaultAssets);
  const [debts, setDebts] = useState(defaultDebts);

  const result = useMemo(
    () => calcAssetBalance(assets, debts),
    [assets, debts],
  );

  const updateAsset = (id: string, patch: Partial<AssetItem>) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );
  };

  const updateDebt = (id: string, patch: Partial<DebtItem>) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    );
  };

  return (
    <div>
      <PageHeader
        title="איזון משאבים"
        subtitle='חוק יח"מ — חלוקה 50/50 לנכסים שנצברו בנישואין'
      />

      <h2 className="mb-3 font-semibold text-slate-900">נכסים</h2>
      <div className="space-y-3">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <Input
              label="שם נכס"
              value={asset.name}
              onChange={(v) => updateAsset(asset.id, { name: v })}
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Input
                label="שווי (₪)"
                type="number"
                value={asset.value}
                onChange={(v) =>
                  updateAsset(asset.id, { value: Number(v) || 0 })
                }
              />
              <Select
                label="נצבר בנישואין?"
                value={asset.acquiredDuringMarriage ? "yes" : "no"}
                onChange={(v) =>
                  updateAsset(asset.id, {
                    acquiredDuringMarriage: v === "yes",
                  })
                }
                options={[
                  { value: "yes", label: "כן — נכלל באיזון" },
                  { value: "no", label: "לא — מוחרג" },
                ]}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        className="mt-3 w-full"
        onClick={() =>
          setAssets((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              name: "נכס חדש",
              value: 0,
              acquiredDuringMarriage: true,
            },
          ])
        }
      >
        + הוסף נכס
      </Button>

      <h2 className="mb-3 mt-8 font-semibold text-slate-900">חובות</h2>
      <div className="space-y-3">
        {debts.map((debt) => (
          <div
            key={debt.id}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <Input
              label="שם חוב"
              value={debt.name}
              onChange={(v) => updateDebt(debt.id, { name: v })}
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Input
                label="סכום (₪)"
                type="number"
                value={debt.amount}
                onChange={(v) =>
                  updateDebt(debt.id, { amount: Number(v) || 0 })
                }
              />
              <Select
                label="חוב משק בית?"
                value={debt.isHouseholdDebt ? "yes" : "no"}
                onChange={(v) =>
                  updateDebt(debt.id, {
                    isHouseholdDebt: v === "yes",
                  })
                }
                options={[
                  { value: "yes", label: "כן — משותף" },
                  { value: "no", label: "לא — אישי" },
                ]}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatBox
          label="נכסים באיזון"
          value={formatCurrency(result.maritalAssets)}
        />
        <StatBox
          label="חובות משותפים"
          value={formatCurrency(result.sharedDebts)}
        />
        <StatBox
          label="נטו לאיזון"
          value={formatCurrency(result.netMarital)}
          highlight
        />
        <StatBox
          label="חלק לכל צד (50%)"
          value={formatCurrency(result.sharePerSpouse)}
          highlight
        />
      </div>

      <p className="mt-4 text-xs text-slate-500">
        נכסים מוחרגים: {formatCurrency(result.excludedAssets)} · חובות
        אישיים: {formatCurrency(result.personalDebts)}
      </p>
    </div>
  );
}
