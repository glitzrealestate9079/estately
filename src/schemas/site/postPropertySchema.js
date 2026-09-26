import * as yup from "yup";

const PINCODE_REGEX = /^[0-9]{6}$/;
const RERA_REGEX = /^[A-Z]{2,4}\/[A-Z]{1,3}\/\d{4}\/\d{3,5}$/;
const PHONE_IN_TEXT_REGEX = /\b[6-9]\d{9}\b/;

// Mirrors the field names used by src/data/properties.js (and, where the
// admin schema already models a concept — plotArea/areaUnit, seatingCapacity/
// washrooms, sharingType/genderPreference/mealPlan, latitude/longitude,
// video/floorPlan — the SAME field names as src/schemas/propertySchema.js)
// so a published listing renders through the exact same PropertyCard /
// detail-page components used for the seeded catalog. Fields the admin
// schema has no equivalent for (plot dimensions, commercial sub-type specs,
// PG tenant/housekeeping details, project unit economics) are new — they
// live only on wizard-created listings, never on admin's own data.
export const postPropertySchema = yup.object({
  sellerType: yup.string().required("Please select who you are"),
  agencyName: yup.string().nullable(),
  listingType: yup.string().required("Please select what you want to do"),
  type: yup.string().when("listingType", {
    is: (v) => v !== "Project",
    then: (schema) => schema.required("Please select a property type"),
    otherwise: (schema) => schema.nullable(),
  }),

  city: yup.string().required("City is required"),
  locality: yup.string().trim().required("Locality is required"),
  subLocality: yup.string().nullable(),
  societyName: yup.string().nullable(),
  landmark: yup.string().nullable(),
  address: yup.string().trim().required("Address is required"),
  pincode: yup.string().required("Pincode is required").matches(PINCODE_REGEX, "Enter a valid 6-digit pincode"),
  latitude: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  longitude: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),

  title: yup.string().trim().required("Give your listing a short title").min(10, "Title should be at least 10 characters").max(80, "Keep the title under 80 characters"),
  bedrooms: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  bathrooms: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  balconies: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  carpetArea: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  builtUpArea: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  plotArea: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  areaUnit: yup.string().default("sqft"),
  floor: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  totalFloors: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  facing: yup.string().nullable(),
  furnishing: yup.string().nullable(),
  propertyAge: yup.string().nullable(),
  parking: yup.boolean().default(false),

  // Plot-specific
  plotType: yup.string().nullable(),
  plotIrregular: yup.boolean().default(false),
  plotLength: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  plotWidth: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  roadWidth: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  approval: yup.string().nullable(),
  corner: yup.boolean().default(false),
  boundary: yup.boolean().default(false),

  // Commercial-specific
  commercialCategory: yup.string().nullable(),
  seatingCapacity: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  washrooms: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  frontage: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  ceilingHeight: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),

  // PG-specific
  sharingType: yup.string().nullable(),
  genderPreference: yup.string().nullable(),
  mealPlan: yup.string().nullable(),
  tenantPreference: yup.string().nullable(),
  wifi: yup.boolean().default(false),
  ac: yup.boolean().default(false),
  attachedBath: yup.boolean().default(false),
  noticePeriod: yup.string().nullable(),
  housekeeping: yup.string().nullable(),
  availableFrom: yup.string().nullable(),

  // Rent-specific
  leaseDuration: yup.string().nullable(),
  depositMonths: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),

  price: yup.number().transform((v, o) => (o === "" ? null : v)).when("listingType", {
    is: "Project",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.typeError("This field is required").required("This field is required").moreThan(0, "Must be greater than 0"),
  }),
  pricePerSqft: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  maintenance: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  securityDeposit: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  negotiable: yup.boolean().default(false),

  amenities: yup.array().of(yup.string()).default([]),
  images: yup.array().min(1, "Add at least one photo — listings without photos are hidden from search").required(),
  video: yup.string().nullable(),
  floorPlan: yup.string().nullable(),

  description: yup.string().trim().required("Add a short description").min(30, "Description should be at least 30 characters").max(2000, "Keep the description under 2000 characters")
    .test("no-phone", "Please remove phone numbers from the description", (v) => !v || !PHONE_IN_TEXT_REGEX.test(v)),

  identityUploaded: yup.boolean().default(false),
  docsUploaded: yup.boolean().default(false),
  locationConfirmed: yup.boolean().default(false),

  reraNumber: yup.string().nullable().when("sellerType", {
    is: "Builder/Developer",
    then: (schema) => schema.required("RERA registration is required for builders/developers").matches(RERA_REGEX, "Enter a valid RERA number, e.g. RJ/P/2024/1234"),
  }),

  // Builder → "List New Project" branch only
  projectName: yup.string().nullable().when("listingType", { is: "Project", then: (schema) => schema.required("Project name is required") }),
  possessionDate: yup.string().nullable(),
  towers: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  totalUnitsCount: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  acres: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  unitTypes: yup.array().of(
    yup.object({ name: yup.string(), size: yup.number().nullable(), price: yup.number().nullable() })
  ).default([]),
  minPrice: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  maxPrice: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
});

export const POST_PROPERTY_DEFAULT_VALUES = {
  sellerType: "",
  agencyName: "",
  listingType: "",
  type: "",
  city: "",
  locality: "",
  subLocality: "",
  societyName: "",
  landmark: "",
  address: "",
  pincode: "",
  latitude: "",
  longitude: "",
  title: "",
  bedrooms: "",
  bathrooms: "",
  balconies: "",
  carpetArea: "",
  builtUpArea: "",
  plotArea: "",
  areaUnit: "sqft",
  floor: "",
  totalFloors: "",
  facing: "",
  furnishing: "",
  propertyAge: "",
  parking: false,
  plotType: "",
  plotIrregular: false,
  plotLength: "",
  plotWidth: "",
  roadWidth: "",
  approval: "",
  corner: false,
  boundary: false,
  commercialCategory: "",
  seatingCapacity: "",
  washrooms: "",
  frontage: "",
  ceilingHeight: "",
  sharingType: "",
  genderPreference: "",
  mealPlan: "",
  tenantPreference: "",
  wifi: false,
  ac: false,
  attachedBath: false,
  noticePeriod: "",
  housekeeping: "",
  availableFrom: "",
  leaseDuration: "",
  depositMonths: "",
  price: "",
  pricePerSqft: "",
  maintenance: "",
  securityDeposit: "",
  negotiable: false,
  amenities: [],
  images: [],
  video: "",
  floorPlan: "",
  description: "",
  identityUploaded: false,
  docsUploaded: false,
  locationConfirmed: false,
  reraNumber: "",
  projectName: "",
  possessionDate: "",
  towers: "",
  totalUnitsCount: "",
  acres: "",
  unitTypes: [],
  minPrice: "",
  maxPrice: "",
};

export const POST_PROPERTY_STEPS = [
  { key: "role", label: "I am", fields: ["sellerType", "agencyName"] },
  { key: "transaction", label: "I want to", fields: ["listingType"] },
  { key: "type", label: "Property Type", fields: ["type"] },
  { key: "location", label: "Location", fields: ["city", "locality", "subLocality", "societyName", "landmark", "address", "pincode"] },
  {
    key: "details",
    label: "Property Details",
    fields: [
      "bedrooms", "bathrooms", "balconies", "carpetArea", "builtUpArea", "floor", "totalFloors", "facing", "furnishing", "propertyAge", "parking",
      "plotArea", "areaUnit", "plotType", "plotLength", "plotWidth", "roadWidth", "approval", "corner", "boundary",
      "commercialCategory", "seatingCapacity", "washrooms", "frontage", "ceilingHeight",
      "sharingType", "genderPreference", "mealPlan", "tenantPreference", "wifi", "ac", "attachedBath", "noticePeriod", "housekeeping",
      "projectName", "possessionDate", "towers", "totalUnitsCount", "acres", "unitTypes",
    ],
  },
  { key: "pricing", label: "Pricing", fields: ["price", "pricePerSqft", "maintenance", "securityDeposit", "negotiable", "leaseDuration", "depositMonths", "availableFrom", "minPrice", "maxPrice"] },
  { key: "amenities", label: "Amenities", fields: ["amenities"] },
  { key: "media", label: "Media", fields: ["images", "video", "floorPlan"] },
  { key: "description", label: "Description", fields: ["title", "description"] },
  { key: "verification", label: "Verification", fields: ["reraNumber"] },
  { key: "preview", label: "Preview", fields: [] },
];

export function kindFor(values) {
  if (values.listingType === "Project") return "project";
  if (values.type === "Plot") return "plot";
  if (values.type === "Commercial" || values.type === "Office Space") return "commercial";
  if (values.listingType === "PG") return "pg";
  return "residential";
}

// Short, kind-specific labels for the stepper sidebar (and matching h1
// headings) on the two steps whose content actually differs by kind.
export function stepTitleFor(step, kind) {
  const overrides = {
    details: { residential: "Property details", plot: "Plot details", commercial: "Commercial details", pg: "PG / Co-living details", project: "Project details" },
    pricing: { residential: "Pricing", plot: "Pricing", commercial: "Pricing", pg: "Pricing & terms", project: "Pricing" },
  };
  return overrides[step]?.[kind] ?? null;
}

// Ported from post-property.js's completeness() — the Preview step's "X%
// complete" bar, computed from the same 8 checks as the original.
export function completenessFor(values) {
  const kind = kindFor(values);
  const goodPhotos = (values.images ?? []).filter((m) => m.status !== "failed").length;
  const checks = [
    values.locality,
    values.subLocality,
    values.carpetArea || values.plotArea || kind === "pg" || kind === "project",
    goodPhotos >= 5,
    (values.description ?? "").length >= 120,
    (values.amenities ?? []).length >= 3,
    values.identityUploaded,
    values.latitude && values.longitude,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function transactionOptionsFor(sellerType) {
  if (sellerType === "Builder/Developer") {
    return [{ value: "Project", label: "List New Project", description: "Apartments, villas or plotted development", icon: "bi-buildings" }];
  }
  return [
    { value: "Sale", label: "Sell", description: "Find a buyer", icon: "bi-house-check" },
    { value: "Rent", label: "Rent / Lease", description: "Find a tenant", icon: "bi-key" },
    { value: "PG", label: "PG / Co-living", description: "Rent out beds or rooms", icon: "bi-people" },
  ];
}

export const SELLER_ROLE_OPTIONS = [
  { value: "Owner", label: "Owner", description: "I own this property directly" },
  { value: "Agent", label: "Agent / Broker", description: "I list on behalf of owners" },
  { value: "Builder/Developer", label: "Builder / Developer", description: "I'm listing a new project" },
];

export const COMMERCIAL_SUBTYPE_CHIPS = ["Office", "Shop", "Showroom", "Warehouse", "Industrial", "Coworking", "Commercial Land"];

export const PROPERTY_TYPES_BY_TRANSACTION = {
  Sale: ["Apartment", "Villa", "Independent House", "Plot", "Farmhouse", "Commercial", "Office Space"],
  Rent: ["Apartment", "Villa", "Independent House", "Commercial", "Office Space"],
  PG: ["PG / Co-living"],
  Project: ["Apartment", "Villa", "Plot"],
};
