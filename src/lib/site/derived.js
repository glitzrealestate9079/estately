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

// Localities/cities are keyed by slug (no digits to lean on), so their seed
// is a simple string hash instead.
function hashSeed(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h || 1;
}

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

export const POSSESSION_STATUSES = ["Ready to Move", "Under Construction"];

export function derivePossession(property) {
  return POSSESSION_STATUSES[seedFromId(property.id) % 2];
}

// "Any" (site card/detail wording) vs admin's real genderPreference field
// wording ("Co-ed") — normalised here so every downstream consumer only
// ever needs to branch on Male/Female/Any.
export const PG_GENDER_OPTIONS = ["Male", "Female", "Any"];

export function derivePgGender(property) {
  if (property.genderPreference) return property.genderPreference === "Co-ed" ? "Any" : property.genderPreference;
  return PG_GENDER_OPTIONS[pseudoRandom(seedFromId(property.id), 3)];
}

export const PG_ROOM_TYPES = ["Single Sharing", "Double Sharing", "Triple Sharing"];

export function derivePgRoomType(property) {
  if (property.sharingType && property.sharingType !== "Dormitory") return `${property.sharingType} Sharing`;
  return PG_ROOM_TYPES[pseudoRandom(seedFromId(property.id) + 3, 3)];
}

export const COMMERCIAL_CATEGORIES = ["Office", "Shop", "Warehouse", "Showroom", "Coworking", "Industrial", "Commercial Land"];

export function deriveCommercialCategory(property) {
  if (property.commercialCategory) return property.commercialCategory;
  if (property.type === "Office Space") return "Office";
  return COMMERCIAL_CATEGORIES[1 + pseudoRandom(seedFromId(property.id), 4)];
}

export const PLOT_APPROVAL_STATUSES = ["RERA Approved", "Authority Approved", "Under Approval"];

export function derivePlotApproval(property) {
  if (property.approval) return property.approval;
  return PLOT_APPROVAL_STATUSES[pseudoRandom(seedFromId(property.id) + 7, 3)];
}

// --- Fields the ported "HomePlace" template's card/detail UI expects that
// the admin schema doesn't model yet. All seeded off the property id, same
// deterministic-derivation pattern as the functions above.

export function derivePgOccupancy(property) {
  const base = property.price;
  return {
    Single: base,
    Double: Math.round((base * 0.72) / 100) * 100,
    Triple: Math.round((base * 0.52) / 100) * 100,
  };
}

export const PG_TENANT_TYPES = ["Students", "Working Professionals", "Students & Professionals"];
export function derivePgTenantType(property) {
  if (property.tenantPreference) return property.tenantPreference;
  return PG_TENANT_TYPES[pseudoRandom(seedFromId(property.id) + 11, 3)];
}

export function derivePgAmenityFlags(property) {
  const seed = seedFromId(property.id);
  return {
    food: property.mealPlan ? property.mealPlan === "Included" : pseudoRandom(seed + 1, 10) > 2,
    wifi: property.wifi ?? pseudoRandom(seed + 2, 10) > 1,
    ac: property.ac ?? pseudoRandom(seed + 3, 10) > 4,
    bath: property.attachedBath ?? pseudoRandom(seed + 4, 10) > 3,
  };
}

export const RENT_TENANT_PREFERENCES = ["Family", "Bachelors", "Family, Bachelors", "Company lease"];
export function deriveRentTenant(property) {
  if (property.tenantPreference) return property.tenantPreference;
  return RENT_TENANT_PREFERENCES[pseudoRandom(seedFromId(property.id) + 5, 4)];
}

export const RENT_LEASE_DURATIONS = ["11 months", "1 year", "2 years", "3+ years"];
export function deriveRentLease(property) {
  if (property.leaseDuration) return property.leaseDuration;
  return RENT_LEASE_DURATIONS[pseudoRandom(seedFromId(property.id) + 6, 4)];
}

export function deriveAvailability(property) {
  if (property.availableFrom) return property.availableFrom;
  const seed = seedFromId(property.id);
  if (property.recentlyPosted || pseudoRandom(seed, 10) > 6) return "Immediately";
  const months = ["Oct", "Nov", "Dec"];
  return `1 ${months[pseudoRandom(seed + 1, months.length)]} 2026`;
}

export function deriveConnectivity(property) {
  return `Well connected to ${property.location.city} business district and major transit routes`;
}

export const PLOT_TYPES = ["Residential Plot", "Agricultural Land", "Farm Land", "Industrial Plot"];
export function derivePlotType(property) {
  if (property.plotType) return property.plotType;
  return PLOT_TYPES[pseudoRandom(seedFromId(property.id) + 9, 4)];
}

export function derivePlotRoadWidth(property) {
  if (property.roadWidth) return property.roadWidth;
  return [20, 30, 40, 60][pseudoRandom(seedFromId(property.id) + 10, 4)];
}

export function derivePlotFlags(property) {
  const seed = seedFromId(property.id);
  return {
    corner: property.corner ?? pseudoRandom(seed + 12, 10) > 6,
    boundary: property.boundary ?? pseudoRandom(seed + 13, 10) > 3,
  };
}

// --- Project fields (src/data/projects.js) the template's project card /
// detail view expects that the admin schema doesn't model — same
// deterministic-derivation approach.

const BHK_SETS = [[2, 3], [2, 3, 4], [3, 4], [1, 2, 3], [3, 4, 5]];
export function deriveProjectBhk(project) {
  return BHK_SETS[pseudoRandom(seedFromId(project.id), BHK_SETS.length)];
}

export function deriveProjectTowers(project) {
  return project.towers ?? 2 + pseudoRandom(seedFromId(project.id) + 1, 8);
}

export function deriveProjectAcres(project) {
  if (project.acres) return project.acres;
  const seed = seedFromId(project.id);
  return +((2 + pseudoRandom(seed + 2, 18) + pseudoRandom(seed + 3, 100) / 100).toFixed(1));
}

export function deriveProjectSizes(project) {
  const seed = seedFromId(project.id);
  const min = 900 + pseudoRandom(seed + 4, 600);
  const max = min + 500 + pseudoRandom(seed + 5, 1200);
  return [min, max];
}

// One synthesized unit-type row per BHK config, sizes/prices interpolated
// across [sizes[0], sizes[1]] / [startingPrice, priceRangeMax] — a simpler
// stand-in for the prototype's fully hand-authored per-tower unit tables,
// which have no real-data equivalent (no per-unit-type admin schema).
export function deriveProjectUnits(project, bhk, sizes, minPrice, maxPrice, availableUnits) {
  const seed = seedFromId(project.id);
  return bhk.map((b, i) => {
    const t = bhk.length > 1 ? i / (bhk.length - 1) : 0;
    const size = Math.round(sizes[0] + (sizes[1] - sizes[0]) * t);
    const price = Math.round(minPrice + (maxPrice - minPrice) * t);
    const available = pseudoRandom(seed + 32 + i, 10) > 7 ? null : 2 + pseudoRandom(seed + 40 + i, availableUnits || 30);
    return { name: `${b} BHK`, size, carpet: Math.round(size * 0.85), price, available };
  });
}

export function deriveProjectTowerNames(count) {
  return Array.from({ length: count }, (_, i) => `Tower ${String.fromCharCode(65 + i)}`);
}

// --- Locality fields (src/lib/site/site-data.js's PUBLIC_LOCALITIES) the
// template's locality card expects that aren't in the admin schema: a star
// rating and a 6-quarter price trend (used only for the YoY-change badge).

export function deriveLocalityRating(locality) {
  const seed = hashSeed(locality.id);
  return +(4.0 + pseudoRandom(seed, 10) / 10).toFixed(1);
}

export function deriveLocalityTrend(avgPricePerSqft) {
  const seed = hashSeed(String(avgPricePerSqft));
  const growth = 0.04 + pseudoRandom(seed, 8) / 100;
  return [0.94, 0.955, 0.965, 0.975, 0.99, 1].map((f) => Math.round(avgPricePerSqft * (1 - growth) * f + avgPricePerSqft * growth));
}

export function deriveLocalityImageIndex(locality) {
  return hashSeed(locality.id);
}

// --- Property-detail-page fields (property-view.js's factsFor/specRows/etc.)
// the admin schema doesn't model — same deterministic-derivation approach.

export const PROPERTY_AGE_BANDS = ["New construction", "1–5 years", "5–10 years", "10+ years"];
export function derivePropertyAge(property) {
  if (property.propertyAge) return property.propertyAge;
  return PROPERTY_AGE_BANDS[pseudoRandom(seedFromId(property.id) + 14, PROPERTY_AGE_BANDS.length)];
}

export function deriveMaintenance(property) {
  if (property.maintenance != null) return property.maintenance;
  const seed = seedFromId(property.id);
  if (pseudoRandom(seed + 15, 10) < 3) return null;
  return Math.round(((property.carpetArea ?? 1000) * (2 + pseudoRandom(seed + 16, 3))) / 100) * 100;
}

export function derivePlotDims(property) {
  if (property.plotIrregular) return "Irregular";
  if (property.plotLength && property.plotWidth) return `${property.plotLength} ft x ${property.plotWidth} ft`;
  const area = property.plotArea ?? property.carpetArea ?? 1200;
  const seed = seedFromId(property.id);
  if (pseudoRandom(seed + 17, 10) < 2) return "Irregular";
  const w = Math.round(Math.sqrt(area) * (0.8 + pseudoRandom(seed + 18, 40) / 100));
  const h = Math.round(area / w);
  return `${w} ft x ${h} ft`;
}

export function derivePgDetails(property) {
  const seed = seedFromId(property.id);
  return {
    notice: property.noticePeriod || ["No notice", "15 days", "30 days"][pseudoRandom(seed + 19, 3)],
    housekeeping: property.housekeeping || ["Daily", "Alternate days", "Weekly"][pseudoRandom(seed + 20, 3)],
    beds: property.bedrooms || 8 + pseudoRandom(seed + 21, 40),
    laundry: pseudoRandom(seed + 22, 10) > 4,
    deposit: property.securityDeposit || Math.round(property.price * (1 + pseudoRandom(seed + 23, 2))),
  };
}

export function deriveCommercialSpecs(property, ctype) {
  const seed = seedFromId(property.id);
  const specs = { metro: 1 + pseudoRandom(seed + 24, 8), road: `${property.location.locality} Main Road` };
  if (ctype === "Office" || ctype === "Coworking") {
    specs.workstations = property.seatingCapacity || 10 + pseudoRandom(seed + 25, 90);
    specs.cabins = property.washrooms || 1 + pseudoRandom(seed + 26, 6);
  } else if (ctype === "Warehouse" || ctype === "Industrial") {
    specs.ceiling = property.ceilingHeight || 18 + pseudoRandom(seed + 27, 14);
  } else if (ctype === "Shop" || ctype === "Showroom" || ctype === "Commercial Land") {
    specs.frontage = property.frontage || 15 + pseudoRandom(seed + 28, 40);
  }
  return specs;
}

export function deriveSellerStats(property) {
  const seed = seedFromId(property.id);
  return {
    since: 2019 + pseudoRandom(seed + 29, 7),
    listings: 1 + pseudoRandom(seed + 30, 24),
    responds: ["Typically responds within an hour", "Typically responds within a few hours", "Typically responds within a day"][pseudoRandom(seed + 31, 3)],
  };
}

// Admin's schema doesn't model an owner email-verification flag yet — most
// (not all) verified-identity sellers are treated as email-verified too, so
// the trust panel's "Email verified" row has a real, stable value to show.
export function deriveEmailVerified(property) {
  if (property.identityVerified !== "Verified") return false;
  return pseudoRandom(seedFromId(property.id) + 41, 10) > 2;
}

const LOCALITY_REVIEWS = [
  { name: "Anita Sharma", rating: 5, date: "Aug 2026", text: "Great connectivity and lots of daily-needs shops within walking distance. Been here 3 years, no complaints." },
  { name: "Rohit Mehta", rating: 4, date: "Jul 2026", text: "Good area for families. Parks are well maintained. Traffic gets heavy during evening hours though." },
  { name: "Priya Nair", rating: 5, date: "Jun 2026", text: "Safe neighbourhood with responsive RWA. Schools and hospitals are all nearby." },
];
export function localityReviews() {
  return LOCALITY_REVIEWS;
}

export function deriveLocalityAround(locality) {
  const seed = hashSeed(locality.id);
  const d = (k) => (((seed >> k) % 30) + 3) / 10;
  return {
    Schools: [["Delhi Public School", `${d(1).toFixed(1)} km`], ["St. Xavier's High School", `${d(3).toFixed(1)} km`], ["Sunrise Convent Sr. Sec. School", `${d(5).toFixed(1)} km`]],
    Hospitals: [["City Care Multispeciality Hospital", `${d(2).toFixed(1)} km`], ["Apollo Clinic", `${d(4).toFixed(1)} km`], ["Sanjeevani Clinic", `${(d(6) / 2).toFixed(1)} km`]],
    Shopping: [["Main market", `${(d(11) / 2).toFixed(1)} km`], ["Shopping mall", `${d(12).toFixed(1)} km`], ["Weekly haat", `${(d(13) / 1.5).toFixed(1)} km`]],
    Restaurants: [["Food street", `${(d(14) / 2).toFixed(1)} km`], ["Café cluster", `${(d(15) / 1.8).toFixed(1)} km`], ["Fine dining", `${d(16).toFixed(1)} km`]],
    Transport: [["City bus stop", `${(d(7) / 3).toFixed(1)} km`], ["Railway station", `${(d(9) * 3).toFixed(1)} km`], ["Airport", `${(d(10) * 4).toFixed(1)} km`]],
    Metro: [["Nearest metro station", `${(d(19) / 2).toFixed(1)} km`]],
    "Road connectivity": [["Main highway", `${d(17).toFixed(1)} km`], ["Ring road", `${(d(18) * 2).toFixed(1)} km`]],
  };
}

export function deriveNearby(property) {
  const seed = seedFromId(property.id);
  const d = (k) => ((seed >> k) % 30 + 3) / 10;
  return {
    Schools: [["Delhi Public School", d(1)], ["St. Xavier's High School", d(3)], ["Sunrise Convent Sr. Sec. School", d(5)]],
    Hospitals: [["City Care Multispeciality Hospital", d(2)], ["Apollo Clinic", d(4)], ["24×7 pharmacy", d(6) / 3]],
    Transit: [["Nearest metro/bus station", d(7) + 1], ["City bus stop", d(8) / 3], ["Railway station", d(9) * 3], ["Airport", d(10) * 4]],
    Shopping: [["Local market", d(11) / 2], ["Supermarket", d(12) / 1.5], ["Shopping mall", d(13) * 1.5]],
  };
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
  return "Posted over a month ago";
}

export function isRecentlyUpdated(dateStr, withinDays = 7) {
  const days = daysAgo(dateStr);
  return days !== null && days <= withinDays;
}
