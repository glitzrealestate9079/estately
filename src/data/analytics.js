export const LISTING_TRENDS = [
  { month: "Jan", newListings: 320, approved: 280, sold: 96, rented: 140 },
  { month: "Feb", newListings: 358, approved: 312, sold: 108, rented: 152 },
  { month: "Mar", newListings: 402, approved: 360, sold: 121, rented: 168 },
  { month: "Apr", newListings: 386, approved: 340, sold: 114, rented: 175 },
  { month: "May", newListings: 440, approved: 398, sold: 132, rented: 190 },
  { month: "Jun", newListings: 468, approved: 420, sold: 148, rented: 205 },
  { month: "Jul", newListings: 452, approved: 405, sold: 139, rented: 198 },
  { month: "Aug", newListings: 498, approved: 452, sold: 156, rented: 212 },
  { month: "Sep", newListings: 512, approved: 470, sold: 164, rented: 224 },
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
const YEAR_LABELS = ["2022", "2023", "2024", "2025", "2026"];

export const LISTING_TRENDS_BY_PERIOD = {
  daily: DAY_LABELS.map((label, i) => ({
    month: label,
    newListings: 14 + ((i * 7) % 22),
    approved: 11 + ((i * 5) % 18),
    sold: 2 + (i % 6),
    rented: 4 + ((i * 3) % 10),
  })),
  weekly: WEEK_LABELS.map((label, i) => ({
    month: label,
    newListings: 90 + i * 12,
    approved: 78 + i * 10,
    sold: 22 + i * 4,
    rented: 34 + i * 5,
  })),
  monthly: LISTING_TRENDS,
  yearly: YEAR_LABELS.map((label, i) => ({
    month: label,
    newListings: 2400 + i * 620,
    approved: 2080 + i * 560,
    sold: 720 + i * 180,
    rented: 1020 + i * 240,
  })),
};

export const PROPERTY_TYPE_DISTRIBUTION = [
  { name: "Apartments", value: 4820, color: "var(--color-primary-500)" },
  { name: "Villas", value: 1640, color: "var(--color-accent-500)" },
  { name: "Plots", value: 1120, color: "var(--color-success-500)" },
  { name: "Commercial", value: 880, color: "var(--color-warning-500)" },
  { name: "PG / Co-living", value: 640, color: "var(--color-info-500)" },
];

export const LEAD_FUNNEL = [
  { stage: "Visitors", value: 48200 },
  { stage: "Enquiries", value: 12400 },
  { stage: "Contacted", value: 8600 },
  { stage: "Site Visits", value: 4200 },
  { stage: "Negotiation", value: 2100 },
  { stage: "Closed", value: 980 },
];

export const REVENUE_OVERVIEW = [
  { month: "Jan", subscription: 820000, featured: 340000, services: 180000 },
  { month: "Feb", subscription: 860000, featured: 365000, services: 196000 },
  { month: "Mar", subscription: 910000, featured: 398000, services: 212000 },
  { month: "Apr", subscription: 940000, featured: 412000, services: 208000 },
  { month: "May", subscription: 1020000, featured: 456000, services: 232000 },
  { month: "Jun", subscription: 1080000, featured: 488000, services: 248000 },
  { month: "Jul", subscription: 1120000, featured: 502000, services: 256000 },
  { month: "Aug", subscription: 1180000, featured: 534000, services: 268000 },
  { month: "Sep", subscription: 1240000, featured: 562000, services: 284000 },
];

// Approximate positions on a 0-100 x/y grid for the India activity map widget.
export const LOCATION_ACTIVITY = [
  { city: "Delhi NCR", x: 46, y: 28, listings: 2840, leads: 1120, intensity: 0.95 },
  { city: "Mumbai", x: 28, y: 58, listings: 3120, leads: 1340, intensity: 1 },
  { city: "Bengaluru", x: 40, y: 78, listings: 2680, leads: 1080, intensity: 0.9 },
  { city: "Pune", x: 32, y: 62, listings: 1860, leads: 760, intensity: 0.7 },
  { city: "Hyderabad", x: 46, y: 68, listings: 1720, leads: 690, intensity: 0.65 },
  { city: "Chennai", x: 44, y: 84, listings: 1540, leads: 620, intensity: 0.6 },
  { city: "Jaipur", x: 38, y: 34, listings: 1280, leads: 510, intensity: 0.5 },
  { city: "Ahmedabad", x: 26, y: 44, listings: 980, leads: 380, intensity: 0.4 },
  { city: "Gurugram", x: 45, y: 27, listings: 1640, leads: 700, intensity: 0.68 },
  { city: "Noida", x: 48, y: 29, listings: 1120, leads: 460, intensity: 0.46 },
];

export const KPI_TREND = {
  properties: [40, 52, 48, 61, 58, 70, 66, 78, 82],
  leads: [22, 28, 24, 34, 30, 40, 36, 46, 52],
  visits: [12, 16, 14, 20, 18, 24, 22, 28, 30],
  revenue: [30, 34, 32, 40, 38, 46, 44, 52, 58],
};
