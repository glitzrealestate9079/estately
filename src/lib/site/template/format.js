// Number/currency formatting matching the ported "HomePlace" template's own
// inr()/num() exactly (₹65 L / ₹1.25 Cr, not the admin-side "Lakh"/"K"
// wording) — the card/detail layouts were sized around this short form.

function trim0(n) {
  return String(+n.toFixed(2));
}

export function inr(n, long) {
  if (n == null) return "—";
  if (n >= 1e7) return `₹${trim0(n / 1e7)}${long ? " Crore" : " Cr"}`;
  if (n >= 1e5) return `₹${trim0(n / 1e5)}${long ? " Lakh" : " L"}`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function num(n) {
  return Math.round(n).toLocaleString("en-IN");
}

// Ported from app.js's sellerLabel() — an Agent is shown as "Broker" on
// rent/PG listings, "Agent" everywhere else.
export function sellerLabel(p) {
  const t = p.seller.type;
  if (t === "Agent") return p.cat === "rent" || p.cat === "pg" ? "Broker" : "Agent";
  if (t === "Builder") return "Builder";
  return "Owner";
}

// Ported from app.js's updatedText(), minus its "Updated " prefix so callers
// can compose their own label ("Updated …", "Last updated", a bare row value).
export function daysAgoText(days) {
  if (days == null) return "";
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return "over a month ago";
}
