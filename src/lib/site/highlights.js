import { derivePossession } from "@/lib/site/derived";

// Every highlight here maps to a real, checkable field on the property — the
// spec is explicit that "why this property matches" copy must never be
// invented (section 100 / "Opportunity 1 — Explain the property").
export function deriveHighlights(property) {
  const highlights = [];

  if (derivePossession(property) === "Ready to Move") highlights.push("Ready to move — no waiting for possession");
  if (property.verified) highlights.push("Verified listing by the platform");
  if (property.rera) highlights.push(`RERA registered${property.reraAuthority ? ` with ${property.reraAuthority}` : ""}`);
  if (property.sellerType === "Owner") highlights.push("Direct from owner — no brokerage");
  if (property.parking) highlights.push("Dedicated parking available");
  if (property.furnishing === "Fully Furnished") highlights.push("Fully furnished — move-in ready");
  if (property.amenities?.length >= 6) highlights.push(`${property.amenities.length} amenities in the community`);
  if (property.floor && property.totalFloors) highlights.push(`Floor ${property.floor} of ${property.totalFloors}`);
  if (property.facing) highlights.push(`${property.facing}-facing`);

  return highlights.slice(0, 6);
}
