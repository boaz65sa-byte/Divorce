"use client";

import { Button, Input, Select } from "@/components/ui";
import {
  CHILD_SUPPORT_END_AGE,
  calcMonthsUntilSupportEnd,
  formatSupportDuration,
} from "@/lib/calc/childSupport";
import type { ChildProfile } from "@/lib/types";

interface ChildrenEditorProps {
  children: ChildProfile[];
  onChange: (children: ChildProfile[]) => void;
  parentAName?: string;
  showCustody?: boolean;
  showDurationHint?: boolean;
}

export function ChildrenEditor({
  children,
  onChange,
  parentAName = "הורה א'",
  showCustody = true,
  showDurationHint = true,
}: ChildrenEditorProps) {
  const updateChild = (id: string, patch: Partial<ChildProfile>) => {
    onChange(
      children.map((child) =>
        child.id === id ? { ...child, ...patch } : child,
      ),
    );
  };

  const addChild = () => {
    onChange([
      ...children,
      {
        id: crypto.randomUUID(),
        age: 8,
        daysWithParentA: 7,
      },
    ]);
  };

  const removeChild = (id: string) => {
    onChange(children.filter((child) => child.id !== id));
  };

  return (
    <div className="space-y-4">
      {children.map((child, index) => (
        <div
          key={child.id}
          className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">
              ילד/ה {index + 1}
            </p>
            {children.length > 1 && (
              <button
                type="button"
                onClick={() => removeChild(child.id)}
                className="text-xs font-medium text-rose-600 hover:text-rose-700"
              >
                הסר
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="גיל (שנים)"
              type="number"
              min={0}
              max={CHILD_SUPPORT_END_AGE}
              value={child.age}
              onChange={(v) =>
                updateChild(child.id, {
                  age: Math.min(CHILD_SUPPORT_END_AGE, Math.max(0, Number(v) || 0)),
                })
              }
              hint={
                showDurationHint
                  ? child.age >= CHILD_SUPPORT_END_AGE
                    ? "מעל גיל 18 — לרוב אין חובת מזונות"
                    : `נותרו ~${formatSupportDuration(calcMonthsUntilSupportEnd(child.age))} עד גיל ${CHILD_SUPPORT_END_AGE}`
                  : undefined
              }
            />

            {showCustody && (
              <Select
                label={`לילות אצל ${parentAName} (מתוך 14)`}
                value={String(child.daysWithParentA)}
                onChange={(v) =>
                  updateChild(child.id, { daysWithParentA: Number(v) })
                }
                options={[
                  { value: "7", label: "7 — משותפת" },
                  { value: "6", label: "6 לילות" },
                  { value: "5", label: "5 לילות" },
                  { value: "4", label: "4 לילות" },
                  { value: "2", label: "2 לילות" },
                  { value: "0", label: "ללא לינה" },
                ]}
              />
            )}
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addChild} className="w-full">
        + הוסף/י ילד/ה
      </Button>
    </div>
  );
}
