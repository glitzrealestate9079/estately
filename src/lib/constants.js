// Semantic style tokens for every status badge used across the admin.
// Keys are matched case-insensitively by <StatusBadge status="..." />.
export const STATUS_STYLES = {
  active: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500 ring-success-600/20",
  approved: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500 ring-success-600/20",
  verified: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500 ring-success-600/20",
  converted: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500 ring-success-600/20",
  completed: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500 ring-success-600/20",
  confirmed: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500 ring-success-600/20",
  success: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500 ring-success-600/20",
  paid: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500 ring-success-600/20",

  pending: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500 ring-warning-600/20",
  "under review": "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500 ring-warning-600/20",
  "follow-up": "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500 ring-warning-600/20",
  requested: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500 ring-warning-600/20",
  rescheduled: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500 ring-warning-600/20",
  "new launch": "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500 ring-warning-600/20",
  "under construction": "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500 ring-warning-600/20",

  rejected: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-500 ring-error-600/20",
  failed: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-500 ring-error-600/20",
  expired: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-500 ring-error-600/20",
  cancelled: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-500 ring-error-600/20",
  lost: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-500 ring-error-600/20",
  inactive: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-500 ring-error-600/20",

  draft: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 ring-slate-500/20",
  paused: "bg-slate-200 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300 ring-slate-500/25",
  archived: "bg-slate-100 text-slate-500 dark:bg-slate-500/5 dark:text-slate-500 ring-slate-500/15",
  new: "bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500 ring-info-600/20",
  contacted: "bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500 ring-info-600/20",
  interested: "bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500 ring-info-600/20",
  "site visit": "bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500 ring-info-600/20",
  negotiation: "bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500 ring-info-600/20",
  rented: "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 ring-primary-600/20",
  upcoming: "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 ring-primary-600/20",
  "ready to move": "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 ring-primary-600/20",

  sold: "bg-accent-500/10 text-accent-600 dark:text-accent-400 ring-accent-500/20",
  featured: "bg-featured-50 text-featured-600 dark:bg-featured-500/10 dark:text-featured-500 ring-featured-500/20",
};

export const DEFAULT_STATUS_STYLE =
  "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 ring-slate-500/20";

export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Independent House",
  "Plot",
  "Commercial",
  "Office Space",
  "PG / Co-living",
  "Farmhouse",
];

export const LISTING_TYPES = ["Sale", "Rent", "PG"];

export const FURNISHING_OPTIONS = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];

export const FACING_OPTIONS = [
  "North",
  "South",
  "East",
  "West",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
];

// Property Details step — PG / Co-living specific fields
export const SHARING_TYPE_OPTIONS = ["Single", "Double", "Triple", "Dormitory"];
export const GENDER_PREFERENCE_OPTIONS = ["Male", "Female", "Co-ed"];
export const MEAL_PLAN_OPTIONS = ["Included", "Not Included"];

export const AMENITIES = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Lift",
  "Security",
  "Power Backup",
  "Garden",
  "Club House",
  "CCTV",
  "Children's Play Area",
  "Rain Water Harvesting",
  "Intercom",
];

export const LEAD_SOURCES = ["Website", "Referral", "Walk-in", "Portal", "Social Media", "Campaign"];

export const INDIAN_STATES = [
  "Rajasthan",
  "Maharashtra",
  "Karnataka",
  "Delhi NCR",
  "Telangana",
  "Tamil Nadu",
  "Gujarat",
  "West Bengal",
];

export const USER_ROLES = [
  "Super Admin",
  "Admin",
  "Property Manager",
  "Sales Manager",
  "Agent",
  "Content Manager",
  "Support",
];
