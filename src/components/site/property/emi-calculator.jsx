"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { inr, num } from "@/lib/site/template/format";

// Ported from the prototype's emiHtml()/bindEmi() in property-view.js.
export function EmiCalculator({ price }) {
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, principal, totalInterest } = useMemo(() => {
    const principal = price * (1 - down / 100);
    const r = rate / 1200;
    const n = years * 12;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { emi, principal, totalInterest: emi * n - principal };
  }, [price, down, rate, years]);

  return (
    <>
      <div className="emi-grid">
        <div className="stack" style={{ "--stack": "18px" }}>
          <div>
            <div className="range-head"><span>Down payment</span><b>{down}% · {inr(price * down / 100)}</b></div>
            <input className="range" type="range" min={10} max={60} step={5} value={down} onChange={(e) => setDown(+e.target.value)} aria-label="Down payment percent" />
          </div>
          <div>
            <div className="range-head"><span>Interest rate</span><b>{rate.toFixed(1)}%</b></div>
            <input className="range" type="range" min={7} max={12} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} aria-label="Interest rate" />
          </div>
          <div>
            <div className="range-head"><span>Loan tenure</span><b>{years} years</b></div>
            <input className="range" type="range" min={5} max={30} step={1} value={years} onChange={(e) => setYears(+e.target.value)} aria-label="Loan tenure in years" />
          </div>
        </div>
        <div className="emi-result">
          <div className="small muted">Estimated monthly EMI</div>
          <div className="price">₹{num(emi)}</div>
          <div className="small muted mt-8">Loan {inr(principal)} · Total interest {inr(totalInterest)}</div>
          <Link className="btn btn-secondary btn-sm mt-16" href="/services">Check loan eligibility</Link>
        </div>
      </div>
      <p className="xs muted mt-12"><i className="bi bi-info-circle" /> Indicative only. Actual EMI depends on the lender, your credit profile and fees.</p>
    </>
  );
}
