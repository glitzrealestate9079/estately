"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { formatIndianCurrency } from "@/lib/site/format";

export function EmiCalculator({ defaultPrice = 5000000, className }) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const { emi, totalInterest, totalRepayment, loanAmount } = useMemo(() => {
    const principal = price * (1 - downPaymentPct / 100);
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    const factor = Math.pow(1 + monthlyRate, months);
    const monthlyEmi = monthlyRate === 0 ? principal / months : (principal * monthlyRate * factor) / (factor - 1);
    const repayment = monthlyEmi * months;
    return {
      emi: Math.round(monthlyEmi),
      totalInterest: Math.round(repayment - principal),
      totalRepayment: Math.round(repayment),
      loanAmount: Math.round(principal),
    };
  }, [price, downPaymentPct, rate, tenure]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SliderField
          label="Property Price"
          value={price}
          display={formatIndianCurrency(price)}
          min={500000}
          max={100000000}
          step={100000}
          onChange={setPrice}
        />
        <SliderField
          label="Down Payment"
          value={downPaymentPct}
          display={`${downPaymentPct}% (${formatIndianCurrency(price * (downPaymentPct / 100))})`}
          min={0}
          max={80}
          step={5}
          onChange={setDownPaymentPct}
        />
        <SliderField label="Interest Rate" value={rate} display={`${rate}% p.a.`} min={6} max={14} step={0.1} onChange={setRate} />
        <SliderField label="Loan Tenure" value={tenure} display={`${tenure} years`} min={1} max={30} step={1} onChange={setTenure} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-primary-50 p-5 dark:bg-primary-500/10 sm:grid-cols-4">
        <Stat label="Loan Amount" value={formatIndianCurrency(loanAmount)} />
        <Stat label="Monthly EMI" value={formatIndianCurrency(emi)} primary />
        <Stat label="Total Interest" value={formatIndianCurrency(totalInterest)} />
        <Stat label="Total Repayment" value={formatIndianCurrency(totalRepayment)} />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-foreground-muted">
        <Calculator className="h-3 w-3" /> Estimate only — actual EMI depends on your lender&apos;s terms and eligibility.
      </p>
    </div>
  );
}

function SliderField({ label, value, display, min, max, step, onChange }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-foreground-muted">{label}</label>
        <span className="text-sm font-semibold text-foreground">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-muted accent-[var(--color-primary-600)]"
      />
    </div>
  );
}

function Stat({ label, value, primary }) {
  return (
    <div>
      <p className="text-[11px] text-foreground-muted">{label}</p>
      <p className={primary ? "font-display text-lg font-bold text-primary-700 dark:text-primary-400" : "font-display text-base font-semibold text-foreground"}>
        {value}
      </p>
    </div>
  );
}
