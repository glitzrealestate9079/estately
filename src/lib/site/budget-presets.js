// Budget presets are expressed in real Indian pricing units (Lakh / Cr for
// sale, thousands per month for rent/PG) so the UI never shows a raw number
// like "2500000" per the spec's "Indian units" requirement.
export const SALE_BUDGET_PRESETS = [
  { label: "Under ₹25 Lakh", min: 0, max: 2500000 },
  { label: "₹25 – 50 Lakh", min: 2500000, max: 5000000 },
  { label: "₹50 Lakh – ₹1 Cr", min: 5000000, max: 10000000 },
  { label: "₹1 Cr – ₹2 Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2 Cr", min: 20000000, max: null },
];

export const RENT_BUDGET_PRESETS = [
  { label: "Under ₹15,000", min: 0, max: 15000 },
  { label: "₹15,000 – ₹25,000", min: 15000, max: 25000 },
  { label: "₹25,000 – ₹40,000", min: 25000, max: 40000 },
  { label: "₹40,000 – ₹75,000", min: 40000, max: 75000 },
  { label: "Above ₹75,000", min: 75000, max: null },
];

export const PG_BUDGET_PRESETS = [
  { label: "Under ₹8,000", min: 0, max: 8000 },
  { label: "₹8,000 – ₹12,000", min: 8000, max: 12000 },
  { label: "₹12,000 – ₹18,000", min: 12000, max: 18000 },
  { label: "Above ₹18,000", min: 18000, max: null },
];

export const COMMERCIAL_BUDGET_PRESETS = [
  { label: "Under ₹50 Lakh", min: 0, max: 5000000 },
  { label: "₹50 Lakh – ₹2 Cr", min: 5000000, max: 20000000 },
  { label: "₹2 Cr – ₹5 Cr", min: 20000000, max: 50000000 },
  { label: "Above ₹5 Cr", min: 50000000, max: null },
];

export const PLOT_BUDGET_PRESETS = [
  { label: "Under ₹20 Lakh", min: 0, max: 2000000 },
  { label: "₹20 – 50 Lakh", min: 2000000, max: 5000000 },
  { label: "₹50 Lakh – ₹1.5 Cr", min: 5000000, max: 15000000 },
  { label: "Above ₹1.5 Cr", min: 15000000, max: null },
];

export const BUDGET_PRESETS_BY_CATEGORY = {
  buy: SALE_BUDGET_PRESETS,
  rent: RENT_BUDGET_PRESETS,
  pg: PG_BUDGET_PRESETS,
  commercial: COMMERCIAL_BUDGET_PRESETS,
  plots: PLOT_BUDGET_PRESETS,
};

export const BHK_OPTIONS = [
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4+ BHK" },
];
