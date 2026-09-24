// Deterministic, presentation-only attributes for the public consumer site.
// The admin data layer (src/data/properties.js) doesn't model every field a
// consumer filter needs yet (possession stage, PG gender preference, etc.),
// so these are derived from a stable seed (the property's numeric id) rather
// than randomised per render. Same input always produces the same output,
// which keeps filtering, SSR and client hydration in agreement.

function seedFromId(id = "") {
  const digits = id.match(/\d+/g)?.join("") ?? "0";
  return Number(digits) || 1;
}

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

export const POSSESSION_STATUSES = ["Ready to Move", "Under Construction"];

export function derivePossession(property) {
  return POSSESSION_STATUSES[seedFromId(property.id) % 2];
}

export const PG_GENDER_OPTIONS = ["Male", "Female", "Any"];

export function derivePgGender(property) {
  return PG_GENDER_OPTIONS[pseudoRandom(seedFromId(property.id), 3)];
}

export const PG_ROOM_TYPES = ["Single Sharing", "Double Sharing", "Triple Sharing"];

export function derivePgRoomType(property) {
  return PG_ROOM_TYPES[pseudoRandom(seedFromId(property.id) + 3, 3)];
}

export const COMMERCIAL_CATEGORIES = ["Office", "Shop", "Warehouse", "Showroom"];

export function deriveCommercialCategory(property) {
  if (property.type === "Office Space") return "Office";
  return COMMERCIAL_CATEGORIES[1 + pseudoRandom(seedFromId(property.id), 3)];
}

export const PLOT_APPROVAL_STATUSES = ["RERA Approved", "Authority Approved", "Under Approval"];

export function derivePlotApproval(property) {
  return PLOT_APPROVAL_STATUSES[pseudoRandom(seedFromId(property.id) + 7, 3)];
}

// Used for card/detail copy — "Posted 3 days ago" — computed against a fixed
// reference date so server and client renders always agree (no Date.now()).
const REFERENCE_NOW = new Date("2026-09-24T00:00:00Z");

export function daysAgo(dateStr) {
  if (!dateStr) return null;
  const then = new Date(dateStr);
  const diffMs = REFERENCE_NOW.getTime() - then.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

export function timeAgoLabel(dateStr) {
  const days = daysAgo(dateStr);
  if (days === null) return "";
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;
  const months = Math.round(days / 30);
  return `Posted ${months} month${months > 1 ? "s" : ""} ago`;
}

export function isRecentlyUpdated(dateStr, withinDays = 7) {
  const days = daysAgo(dateStr);
  return days !== null && days <= withinDays;
}
