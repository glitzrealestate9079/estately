import * as yup from "yup";

const PHONE_REGEX = /^\+?[0-9\s-]{10,15}$/;
const PINCODE_REGEX = /^[0-9]{6}$/;

// How long a completed verification stays valid before an admin needs to
// re-verify the listing. There's no separate `verifiedAt` timestamp in this
// data model, so `verifiedUntil` below is simply "today + this many days",
// (re)computed the moment all three checks (phone/identity/property) read
// Verified — see the Verification step and VerificationChecklist.
export const VERIFICATION_VALIDITY_DAYS = 180;

// Property type groupings that drive which Details-step fields apply to a given
// propertyType (see PROPERTY_TYPES in src/lib/constants.js for the full list of
// the 8 values these are drawn from). Shared between this schema's conditional
// validation and the Details step's conditional field rendering.
export const RESIDENTIAL_PROPERTY_TYPES = ["Apartment", "Villa", "Independent House", "Farmhouse"];
export const PLOT_PROPERTY_TYPES = ["Plot"];
export const COMMERCIAL_PROPERTY_TYPES = ["Commercial", "Office Space"];
export const PG_PROPERTY_TYPES = ["PG / Co-living"];

export const propertySchema = yup.object({
  // Basic Information
  title: yup
    .string()
    .trim()
    .required("Property title is required")
    .min(10, "Title should be at least 10 characters"),
  propertyType: yup.string().required("Please select a property type"),
  listingType: yup.string().required("Please select a listing type"),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(30, "Description should be at least 30 characters"),

  // Location
  country: yup.string().required("Country is required"),
  state: yup.string().required("Please select a state"),
  city: yup.string().required("Please select a city"),
  locality: yup.string().required("Locality is required"),
  address: yup.string().required("Address is required"),
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(PINCODE_REGEX, "Please enter a valid 6-digit pincode"),
  latitude: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  longitude: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),

  // Property Details — base fields shared across types, with area requirements
  // conditional on propertyType (see RESIDENTIAL/PLOT/COMMERCIAL/PG groupings above).
  bedrooms: yup.number().nullable().transform((v, o) => (o === "" ? null : v)).min(0, "Cannot be negative"),
  bathrooms: yup.number().nullable().transform((v, o) => (o === "" ? null : v)).min(0, "Cannot be negative"),
  balconies: yup.number().nullable().transform((v, o) => (o === "" ? null : v)).min(0, "Cannot be negative"),
  carpetArea: yup
    .number()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .when("propertyType", {
      is: (val) => RESIDENTIAL_PROPERTY_TYPES.includes(val),
      then: (schema) =>
        schema
          .typeError("Carpet area is required")
          .required("Carpet area is required")
          .moreThan(0, "Carpet area must be greater than 0"),
    }),
  builtUpArea: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  plotArea: yup
    .number()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .when("propertyType", {
      is: (val) => PLOT_PROPERTY_TYPES.includes(val),
      then: (schema) =>
        schema
          .typeError("Plot area is required")
          .required("Plot area is required")
          .moreThan(0, "Plot area must be greater than 0"),
    }),
  areaUnit: yup.string().default("sqft"),
  floor: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  totalFloors: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  facing: yup.string().nullable(),
  furnishing: yup.string().nullable(),
  parking: yup.boolean().default(false),

  // Commercial / Office Space specific
  seatingCapacity: yup.number().nullable().transform((v, o) => (o === "" ? null : v)).min(0, "Cannot be negative"),
  washrooms: yup.number().nullable().transform((v, o) => (o === "" ? null : v)).min(0, "Cannot be negative"),

  // PG / Co-living specific
  sharingType: yup.string().nullable(),
  genderPreference: yup.string().nullable(),
  mealPlan: yup.string().nullable(),

  // Pricing
  price: yup
    .number()
    .typeError("Price is required")
    .required("Price is required")
    .moreThan(0, "Price must be greater than 0"),
  pricePerSqft: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  maintenance: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  securityDeposit: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),

  // Amenities
  amenities: yup.array().of(yup.string()).default([]),

  // Media
  images: yup.array().min(1, "Please upload at least one property image").required(),
  video: yup.string().url("Please enter a valid video URL").nullable().transform((v) => (v ? v : null)),
  floorPlan: yup.string().nullable(),

  // Owner Information
  ownerName: yup.string().trim().required("Owner name is required"),
  ownerPhone: yup
    .string()
    .required("Owner phone is required")
    .matches(PHONE_REGEX, "Please enter a valid phone number"),
  ownerEmail: yup
    .string()
    .trim()
    .required("Owner email is required")
    .email("Please enter a valid email address"),
  sellerType: yup
    .string()
    .required("Please select a seller type")
    .oneOf(["Owner", "Agent", "Builder/Developer"], "Please select a valid seller type"),

  // Verification
  reraNumber: yup.string().nullable(),
  verificationStatus: yup.string().required("Please select a verification status"),
  reraAuthority: yup.string().nullable(),
  reraStatus: yup
    .string()
    .nullable()
    .oneOf(["Registered", "Pending", "Not Applicable", null], "Please select a valid RERA status")
    .default("Not Applicable"),
  phoneVerified: yup.boolean().default(false),
  identityVerified: yup
    .string()
    .oneOf(["Pending", "Verified", "Rejected"], "Please select a valid identity verification status")
    .default("Pending"),
  propertyVerified: yup
    .string()
    .oneOf(["Pending", "Verified", "Rejected"], "Please select a valid property verification status")
    .default("Pending"),
  // Auto-managed by the Verification step, not user-editable — nullable so it
  // simply carries "not currently verified" until all three checks pass.
  verifiedUntil: yup.string().nullable().default(null),
});

export const PROPERTY_DEFAULT_VALUES = {
  title: "",
  propertyType: "",
  listingType: "",
  description: "",
  country: "India",
  state: "",
  city: "",
  locality: "",
  address: "",
  pincode: "",
  latitude: "",
  longitude: "",
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
  parking: false,
  seatingCapacity: "",
  washrooms: "",
  sharingType: "",
  genderPreference: "",
  mealPlan: "",
  price: "",
  pricePerSqft: "",
  maintenance: "",
  securityDeposit: "",
  amenities: [],
  images: [],
  video: "",
  floorPlan: "",
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  sellerType: "",
  reraNumber: "",
  verificationStatus: "Pending",
  reraAuthority: "",
  reraStatus: "Not Applicable",
  phoneVerified: false,
  identityVerified: "Pending",
  propertyVerified: "Pending",
  // null by default (nothing verified yet). Set once all three checks above
  // pass — see VERIFICATION_VALIDITY_DAYS comment for why this is computed
  // rather than stored against a separate verification timestamp.
  verifiedUntil: null,
};

// Drives the multi-step wizard: which fields must validate before "Continue" is enabled.
export const PROPERTY_STEPS = [
  { key: "basic", label: "Basic Information", fields: ["title", "propertyType", "listingType", "description"] },
  { key: "location", label: "Location", fields: ["country", "state", "city", "locality", "address", "pincode"] },
  {
    key: "details",
    label: "Property Details",
    // Superset of every propertyType's fields — the Details step only renders the
    // subset relevant to the selected type, and the yup schema above only enforces
    // `required` for the fields that type actually applies to, so triggering
    // validation against this full list is safe regardless of which type is selected.
    fields: [
      "bedrooms",
      "bathrooms",
      "balconies",
      "carpetArea",
      "builtUpArea",
      "plotArea",
      "areaUnit",
      "floor",
      "totalFloors",
      "facing",
      "furnishing",
      "parking",
      "seatingCapacity",
      "washrooms",
      "sharingType",
      "genderPreference",
      "mealPlan",
    ],
  },
  { key: "pricing", label: "Pricing", fields: ["price", "pricePerSqft", "maintenance", "securityDeposit"] },
  { key: "amenities", label: "Amenities", fields: ["amenities"] },
  { key: "media", label: "Media", fields: ["images", "video", "floorPlan"] },
  { key: "owner", label: "Owner / Agent", fields: ["ownerName", "ownerPhone", "ownerEmail", "sellerType"] },
  {
    key: "verification",
    label: "Verification",
    fields: ["reraNumber", "verificationStatus", "reraAuthority", "reraStatus", "phoneVerified", "identityVerified", "propertyVerified"],
  },
  { key: "preview", label: "Preview", fields: [] },
];
