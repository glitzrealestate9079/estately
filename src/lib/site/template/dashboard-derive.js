// Fields the ported seller-dashboard design expects (listing health tips,
// expiry countdown, per-listing leads) that owner-posted listings
// (src/components/site/providers/site-provider.jsx's myListings, built via
// buildListingFromWizard) don't carry yet — derived deterministically from
// the listing's own real fields, same approach as src/lib/site/derived.js.

function seedFromId(id = "") {
  const digits = id.match(/\d+/g)?.join("") ?? "0";
  return Number(digits) || 1;
}

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

// Matches app.js's relTime() wording ("today"/"yesterday"/"N days ago") at
// the day-level granularity this app's synthesized lead/visit data supports.
export function daysAgoLabel(days) {
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export function deriveListingHealth(listing) {
  const tips = [];
  if ((listing.images?.length ?? 0) < 5) tips.push("Add more photos — listings with 5+ photos get more enquiries");
  if ((listing.description?.length ?? 0) < 120) tips.push("Write a longer description");
  if (!listing.amenities?.length) tips.push("Add amenities to stand out");
  return tips;
}

export function deriveListingExpiry(listing) {
  if (listing.status !== "Active") return null;
  const seed = seedFromId(listing.id);
  return 5 + pseudoRandom(seed, 55);
}

const LEAD_NAMES = ["Aditya Sharma", "Neha Kapoor", "Rohit Malhotra", "Priya Nair", "Sanjay Mehta", "Kavya Reddy", "Arjun Bhatt", "Divya Iyer"];
const LEAD_SOURCES = ["Search", "WhatsApp", "Call", "Saved search alert"];
const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Visit Scheduled", "Closed"];
const PREFERRED_CONTACT = ["Call", "WhatsApp"];

export function deriveLeadsForListing(listing) {
  const seed = seedFromId(listing.id);
  const count = Math.min(6, Math.max(1, Math.round((listing.enquiries ?? 3) / 4)));
  return Array.from({ length: count }, (_, i) => {
    const s = seed + i * 7;
    return {
      id: `${listing.id}-lead-${i}`,
      name: LEAD_NAMES[pseudoRandom(s, LEAD_NAMES.length)],
      phone: `+91 9${(800000000 + s * 137).toString().slice(0, 9)}`,
      daysAgo: pseudoRandom(s + 1, 20),
      source: LEAD_SOURCES[pseudoRandom(s + 2, LEAD_SOURCES.length)],
      status: LEAD_STATUSES[pseudoRandom(s + 3, i === 0 ? 1 : LEAD_STATUSES.length)],
      preferredContact: PREFERRED_CONTACT[pseudoRandom(s + 4, PREFERRED_CONTACT.length)],
      message: "Is this still available? I'd like to know more.",
      listingId: listing.id,
      listingTitle: listing.title,
      listingLocality: listing.location?.locality,
    };
  });
}
