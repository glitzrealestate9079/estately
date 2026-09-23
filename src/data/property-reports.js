import { PROPERTIES } from "@/data/properties";

// Deterministic set of user-submitted listing reports, for the "Reported
// Listings" moderation tab on the Property Approvals page. Each entry
// references a real property from PROPERTIES by index.
const REPORT_SEEDS = [
  {
    index: 2,
    reason: "Wrong Information",
    reporterName: "Ananya Iyer",
    note: "The listing says 2 BHK but the floor plan shown is clearly a 3 BHK layout.",
    reportedAt: "2026-02-04",
    status: "Open",
  },
  {
    index: 5,
    reason: "Duplicate Listing",
    reporterName: "Rohit Malhotra",
    note: "This exact villa is already listed under a different property ID with the same photos.",
    reportedAt: "2026-02-11",
    status: "Open",
  },
  {
    index: 9,
    reason: "Fraud / Suspicious",
    reporterName: "Priya Nair",
    note: "Owner asked for a booking advance before allowing any site visit, which feels like a scam.",
    reportedAt: "2026-02-19",
    status: "Open",
  },
  {
    index: 13,
    reason: "Wrong Price",
    reporterName: "Vikas Choudhary",
    note: "The agent quoted a price nearly 20% higher than what is shown on the listing.",
    reportedAt: "2026-03-02",
    status: "Open",
  },
  {
    index: 17,
    reason: "Property Unavailable",
    reporterName: "Neha Kapoor",
    note: "Called the owner and was told this space was rented out over a month ago.",
    reportedAt: "2026-03-09",
    status: "Open",
  },
  {
    index: 21,
    reason: "Other",
    reporterName: "Sameer Joshi",
    note: "Listing images do not match the actual unit shown during the site visit.",
    reportedAt: "2026-03-16",
    status: "Resolved",
  },
  {
    index: 24,
    reason: "Wrong Information",
    reporterName: "Divya Menon",
    note: "Amenities list includes a clubhouse that residents say was never built.",
    reportedAt: "2026-03-21",
    status: "Resolved",
  },
];

export const PROPERTY_REPORTS = REPORT_SEEDS.map((seed, i) => {
  const property = PROPERTIES[seed.index];
  return {
    id: `RPT-${3000 + i}`,
    propertyId: property.id,
    propertyTitle: property.title,
    reason: seed.reason,
    reporterName: seed.reporterName,
    note: seed.note,
    reportedAt: seed.reportedAt,
    status: seed.status,
  };
});
