"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const DEFAULT_VALUES = {
  monthlyRent: "22000",
  propertyPrice: "5000000",
  downPayment: "1000000",
  interestRate: "8.5",
  appreciationRate: "3",
  horizonYears: "5",
};

// Same reducing-balance EMI formula as EmiCalculator.jsx.
function calculateEmi(principal, monthlyRate, months) {
  if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(months) || months <= 0) {
    return 0;
  }
  if (!Number.isFinite(monthlyRate) || monthlyRate === 0) {
    return principal / months;
  }
  const factor = Math.pow(1 + monthlyRate, months);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Number.isFinite(emi) && emi > 0 ? emi : 0;
}

export function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = useState(DEFAULT_VALUES.monthlyRent);
  const [propertyPrice, setPropertyPrice] = useState(DEFAULT_VALUES.propertyPrice);
  const [downPayment, setDownPayment] = useState(DEFAULT_VALUES.downPayment);
  const [interestRate, setInterestRate] = useState(DEFAULT_VALUES.interestRate);
  const [appreciationRate, setAppreciationRate] = useState(DEFAULT_VALUES.appreciationRate);
  const [horizonYears, setHorizonYears] = useState(DEFAULT_VALUES.horizonYears);

  const { totalRentCost, totalBuyCost, recommendation } = useMemo(() => {
    const rent = Number(monthlyRent);
    const price = Number(propertyPrice);
    const down = Number(downPayment);
    const annualRate = Number(interestRate);
    const appreciation = Number(appreciationRate);
    const years = Number(horizonYears);

    const safeRent = Number.isFinite(rent) && rent > 0 ? rent : 0;
    const safeYears = Number.isFinite(years) && years > 0 ? years : 0;
    const safePrice = Number.isFinite(price) && price > 0 ? price : 0;
    const safeAppreciation = Number.isFinite(appreciation) ? appreciation : 0;

    const months = safeYears * 12;
    const totalRentCost = safeRent * 12 * safeYears;

    const principal = price - down;
    const monthlyRate = annualRate / 12 / 100;
    const emi = calculateEmi(principal, monthlyRate, months);
    const totalEmiPaid = emi * months;

    const appreciatedValue = safePrice > 0 ? safePrice * Math.pow(1 + safeAppreciation / 100, safeYears) : 0;

    const rawBuyCost = totalEmiPaid + Math.max(down, 0) - appreciatedValue;
    const totalBuyCost = Number.isFinite(rawBuyCost) ? rawBuyCost : 0;

    let recommendation = "Fill in the numbers above to compare renting and buying.";
    if (safeYears > 0) {
      if (totalBuyCost < totalRentCost) {
        recommendation = `Buying works out cheaper by ${formatCurrency(totalRentCost - totalBuyCost)} over ${safeYears} year${safeYears === 1 ? "" : "s"}.`;
      } else if (totalRentCost < totalBuyCost) {
        recommendation = `Renting works out cheaper by ${formatCurrency(totalBuyCost - totalRentCost)} over ${safeYears} year${safeYears === 1 ? "" : "s"}.`;
      } else {
        recommendation = "Renting and buying cost roughly the same over this horizon.";
      }
    }

    return { totalRentCost, totalBuyCost, recommendation };
  }, [monthlyRent, propertyPrice, downPayment, interestRate, appreciationRate, horizonYears]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle>Rent vs Buy Inputs</CardTitle>
          <CardDescription>Compare the total cost of renting against buying over the same time horizon.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="Monthly Rent" htmlFor="rvb-monthly-rent">
            <Input
              id="rvb-monthly-rent"
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="e.g. 22000"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Property Price" htmlFor="rvb-property-price">
              <Input
                id="rvb-property-price"
                type="number"
                min="0"
                inputMode="decimal"
                placeholder="e.g. 5000000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
              />
            </FormField>
            <FormField label="Down Payment" htmlFor="rvb-down-payment">
              <Input
                id="rvb-down-payment"
                type="number"
                min="0"
                inputMode="decimal"
                placeholder="e.g. 1000000"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
              />
            </FormField>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Loan Interest Rate (%)" htmlFor="rvb-interest-rate">
              <Input
                id="rvb-interest-rate"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 8.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </FormField>
            <FormField label="Annual Price Appreciation (%)" htmlFor="rvb-appreciation-rate">
              <Input
                id="rvb-appreciation-rate"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 3"
                value={appreciationRate}
                onChange={(e) => setAppreciationRate(e.target.value)}
              />
            </FormField>
          </div>
          <FormField label="Time Horizon (years)" htmlFor="rvb-horizon">
            <Input
              id="rvb-horizon"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="e.g. 5"
              value={horizonYears}
              onChange={(e) => setHorizonYears(e.target.value)}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparison</CardTitle>
          <CardDescription>Total cost over the selected time horizon.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-foreground-muted">Total Cost of Renting</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(totalRentCost)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground-muted">Total Cost of Buying</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(totalBuyCost)}</p>
            </div>
          </div>

          <p className="rounded-xl bg-primary-50 p-4 text-sm font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
            {recommendation}
          </p>

          <div className="space-y-2 border-t border-border-subtle pt-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Assumptions used in this estimate
            </p>
            <ul className="list-disc space-y-1 pl-5 text-xs text-foreground-muted">
              <li>The loan interest rate is fixed for the full tenure.</li>
              <li>Maintenance, taxes and transaction costs are ignored for both options.</li>
              <li>Property value is assumed to grow at a constant annual rate for the full horizon.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
