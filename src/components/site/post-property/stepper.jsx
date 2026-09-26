"use client";

import { POST_PROPERTY_STEPS, stepTitleFor } from "@/schemas/site/postPropertySchema";

export function PostPropertyStepper({ currentIndex, furthestIndex, pct, onStepClick, kind }) {
  return (
    <nav className="wz-steps" aria-label="Steps">
      <div className="between" style={{ padding: "0 8px" }}>
        <span className="strong small">Post property</span>
        <span className="xs muted">{pct}%</span>
      </div>
      <div className="wz-progress"><span style={{ width: `${pct}%` }} /></div>
      {POST_PROPERTY_STEPS.map((step, index) => {
        const label = stepTitleFor(step.key, kind) ?? step.label;
        const done = index < furthestIndex;
        const current = index === currentIndex;
        const clickable = index <= furthestIndex;
        return (
          <button
            key={step.key}
            type="button"
            className={`wz-step ${done ? "is-done" : ""} ${current ? "is-current" : ""}`}
            disabled={!clickable}
            aria-current={current ? "step" : undefined}
            onClick={() => clickable && onStepClick(index)}
          >
            <span className="n">{index + 1}</span>{label}
          </button>
        );
      })}
    </nav>
  );
}
