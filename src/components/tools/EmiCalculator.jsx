"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const DEFAULT_VALUES = {
  propertyPrice: "5000000",
  downPayment: "1000000",
  interestRate: "8.5",
  tenureYears: "20",
};

export function EmiCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(DEFAULT_VALUES.propertyPrice);
  const [downPayment, setDownPayment] = useState(DEFAULT_VALUES.downPayment);
  const [interestRate, setInterestRate] = useState(DEFAULT_VALUES.interestRate);
  const [tenureYears, setTenureYears] = useState(DEFAULT_VALUES.tenureYears);

  const { emi, totalInterest, totalRepayment } = useMemo(() => {
    const price = Number(propertyPrice);
    const down = Number(downPayment);
    const annualRate = Number(interestRate);
    const years = Number(tenureYears);

    const principal = price - down;
    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;

    let emi = 0;
    if (Number.isFinite(principal) && principal > 0 && Number.isFinite(months) && months > 0) {
      if (!Number.isFinite(monthlyRate) || monthlyRate === 0) {
        // No-interest edge case: avoid the (1 + r)^n - 1 divide-by-zero below.
        emi = principal / months;
      } else {
        const factor = Math.pow(1 + monthlyRate, months);
        const computed = (principal * monthlyRate * factor) / (factor - 1);
        emi = Number.isFinite(computed) && computed > 0 ? computed : 0;
      }
    }

    const totalRepayment = emi * months;
    const totalInterest = Math.max(totalRepayment - Math.max(principal, 0), 0);

    return {
      emi,
      totalInterest: Number.isFinite(totalInterest) ? totalInterest : 0,
      totalRepayment: Number.isFinite(totalRepayment) ? totalRepayment : 0,
    };
  }, [propertyPrice, downPayment, interestRate, tenureYears]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>Enter the property price and loan terms to estimate the EMI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="Property Price" htmlFor="emi-property-price">
            <Input
              id="emi-property-price"
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="e.g. 5000000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(e.target.value)}
            />
          </FormField>
          <FormField label="Down Payment" htmlFor="emi-down-payment">
            <Input
              id="emi-down-payment"
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="e.g. 1000000"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Interest Rate (% p.a.)" htmlFor="emi-interest-rate">
              <Input
                id="emi-interest-rate"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 8.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </FormField>
            <FormField label="Tenure (years)" htmlFor="emi-tenure">
              <Input
                id="emi-tenure"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="e.g. 20"
                value={tenureYears}
                onChange={(e) => setTenureYears(e.target.value)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estimated Repayment</CardTitle>
          <CardDescription>Based on a standard reducing-balance EMI calculation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-500/10">
            <p className="text-xs font-medium text-foreground-muted">Monthly EMI</p>
            <p className="mt-1 font-display text-3xl font-bold tracking-tight text-primary-700 dark:text-primary-400">
              {formatCurrency(emi)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-foreground-muted">Total Interest Payable</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(totalInterest)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground-muted">Total Repayment</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(totalRepayment)}</p>
            </div>
          </div>
          <p className="flex items-start gap-1.5 text-xs text-foreground-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            This is an estimate only. The actual EMI depends on the lender&apos;s exact terms, processing
            fees and interest computation method.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
