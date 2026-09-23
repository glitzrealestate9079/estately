// Regional area-unit handling for property listings, including Bigha, whose
// square-footage varies by state/region in India and has no single national
// conversion factor.

export const AREA_UNITS = ["sqft", "sqyd", "sqm", "acre", "bigha"];

export const AREA_UNIT_LABELS = {
  sqft: "sq.ft",
  sqyd: "sq.yd",
  sqm: "sq.m",
  acre: "acre",
  bigha: "bigha",
};

// Approximate Bigha -> sq.ft factors for states already used in INDIAN_STATES.
// Bigha size is not standardized nationally, so states without a confirmed
// factor map to null (unknown) rather than guessing.
export const STATE_BIGHA_FACTORS = {
  Rajasthan: 27225,
  Maharashtra: null,
  Karnataka: null,
  "Delhi NCR": 9070,
  Telangana: null,
  "Tamil Nadu": null,
  Gujarat: null,
  "West Bengal": 14400,
};

/**
 * Converts a numeric area value in the given unit to an approximate value in
 * square feet. Returns null when the value cannot be reliably converted
 * (e.g. a Bigha figure for a state with no known factor).
 */
export function convertAreaToSqft(value, unit, stateName) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;

  switch (unit) {
    case "sqft":
      return numeric * 1;
    case "sqyd":
      return numeric * 9;
    case "sqm":
      return numeric * 10.7639;
    case "acre":
      return numeric * 43560;
    case "bigha": {
      const factor = STATE_BIGHA_FACTORS[stateName];
      if (!factor) return null;
      return numeric * factor;
    }
    default:
      return null;
  }
}

/**
 * Short display string for a value + unit pair, e.g. "1850 sq.ft".
 */
export function formatAreaWithUnit(value, unit) {
  if (value === null || value === undefined || value === "") return "—";
  const label = AREA_UNIT_LABELS[unit] ?? unit ?? "";
  return label ? `${value} ${label}` : `${value}`;
}
