"use client";

import { useMemo, useState } from "react";
import { Landmark, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDIAN_STATES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

// Illustrative stamp duty rates (%) by state, as of Q3 2026. These are indicative only —
// always confirm the current rate with the local sub-registrar office before quoting a buyer.
const STAMP_DUTY_RATE_PERCENT_BY_STATE = {
  Rajasthan: 6,
  Maharashtra: 6,
  Karnataka: 5,
  "Delhi NCR": 6,
  Telangana: 6,
  "Tamil Nadu": 7,
  Gujarat: 4.9,
  "West Bengal": 7,
};

const REGISTRATION_FEE_PERCENT = 1;

export function StampDutyEstimator() {
  const [state, setState] = useState("");
  const [propertyValue, setPropertyValue] = useState("5000000");

  const { stampDuty, registrationFee, ratePercent } = useMemo(() => {
    const value = Number(propertyValue);
    const safeValue = Number.isFinite(value) && value > 0 ? value : 0;
    const rate = STAMP_DUTY_RATE_PERCENT_BY_STATE[state] ?? 0;

    return {
      stampDuty: (safeValue * rate) / 100,
      registrationFee: (safeValue * REGISTRATION_FEE_PERCENT) / 100,
      ratePercent: rate,
    };
  }, [state, propertyValue]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle>Property &amp; Location</CardTitle>
          <CardDescription>
            Stamp duty is set by each state government, so pick the state where the property is registered.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="State">
            <Select value={state || undefined} onValueChange={setState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Property Value" htmlFor="stamp-duty-property-value">
            <Input
              id="stamp-duty-property-value"
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="e.g. 5000000"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estimated Charges</CardTitle>
          <CardDescription>Stamp duty plus registration fee for the selected state.</CardDescription>
        </CardHeader>
        <CardContent>
          {!state ? (
            <EmptyState
              icon={Landmark}
              title="Select a state to see an estimate"
              description="Stamp duty rates are set by each state government, so pick one to calculate the charges."
            />
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-foreground-muted">Stamp Duty ({ratePercent}%)</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(stampDuty)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground-muted">
                    Registration Fee ({REGISTRATION_FEE_PERCENT}%)
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(registrationFee)}</p>
                </div>
              </div>
              <p className="flex items-start gap-1.5 text-xs text-foreground-muted">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Illustrative rates as of Q3 2026 for {state}. Always confirm the current rate with the local
                sub-registrar office before quoting a buyer.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
