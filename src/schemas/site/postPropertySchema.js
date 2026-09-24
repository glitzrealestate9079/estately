import * as yup from "yup";

const PINCODE_REGEX = /^[0-9]{6}$/;

// Mirrors the field names used by src/data/properties.js so a published
// listing can be rendered through the exact same PropertyCard / detail-page
// components used for the seeded catalog — no adapter layer needed.
export const postPropertySchema = yup.object({
  sellerType: yup.string().required("Please select who you are"),
  listingType: yup.string().required("Please select what you want to do"),
  type: yup.string().required("Please select a property type"),

  city: yup.string().required("City is required"),
  locality: yup.string().trim().required("Locality is required"),
  address: yup.string().trim().required("Address is required"),
  pincode: yup.string().required("Pincode is required").matches(PINCODE_REGEX, "Enter a valid 6-digit pincode"),

  title: yup.string().trim().required("Give your listing a short title").min(10, "Title should be at least 10 characters"),
  bedrooms: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  bathrooms: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  balconies: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  carpetArea: yup.number().typeError("Carpet area is required").required("Carpet area is required").moreThan(0, "Must be greater than 0"),
  builtUpArea: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  floor: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  totalFloors: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  facing: yup.string().nullable(),
  furnishing: yup.string().nullable(),
  parking: yup.boolean().default(false),

  price: yup.number().typeError("This field is required").required("This field is required").moreThan(0, "Must be greater than 0"),
  maintenance: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  securityDeposit: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  negotiable: yup.boolean().default(false),

  amenities: yup.array().of(yup.string()).default([]),
  images: yup.array().min(3, "Add at least 3 photos so buyers can trust your listing").required(),

  description: yup.string().trim().required("Add a short description").min(30, "Description should be at least 30 characters"),

  reraNumber: yup.string().nullable(),
  authorized: yup.boolean().oneOf([true], "Please confirm you're authorised to list this property"),
});

export const POST_PROPERTY_DEFAULT_VALUES = {
  sellerType: "",
  listingType: "",
  type: "",
  city: "",
  locality: "",
  address: "",
  pincode: "",
  title: "",
  bedrooms: "",
  bathrooms: "",
  balconies: "",
  carpetArea: "",
  builtUpArea: "",
  floor: "",
  totalFloors: "",
  facing: "",
  furnishing: "",
  parking: false,
  price: "",
  maintenance: "",
  securityDeposit: "",
  negotiable: false,
  amenities: [],
  images: [],
  description: "",
  reraNumber: "",
  authorized: false,
};

export const POST_PROPERTY_STEPS = [
  { key: "role", label: "I am", fields: ["sellerType"] },
  { key: "transaction", label: "I want to", fields: ["listingType"] },
  { key: "type", label: "Property Type", fields: ["type"] },
  { key: "location", label: "Location", fields: ["city", "locality", "address", "pincode"] },
  {
    key: "details",
    label: "Property Details",
    fields: ["title", "bedrooms", "bathrooms", "balconies", "carpetArea", "builtUpArea", "floor", "totalFloors", "facing", "furnishing", "parking"],
  },
  { key: "pricing", label: "Pricing", fields: ["price", "maintenance", "securityDeposit", "negotiable"] },
  { key: "amenities", label: "Amenities", fields: ["amenities"] },
  { key: "media", label: "Media", fields: ["images"] },
  { key: "description", label: "Description", fields: ["description"] },
  { key: "verification", label: "Verification", fields: ["reraNumber", "authorized"] },
  { key: "preview", label: "Preview", fields: [] },
];

export const TRANSACTION_OPTIONS = [
  { value: "Sale", label: "Sell", description: "List your property for sale" },
  { value: "Rent", label: "Rent / Lease", description: "Find a tenant for your property" },
  { value: "PG", label: "PG / Co-living", description: "List a room or PG accommodation" },
];

export const SELLER_ROLE_OPTIONS = [
  { value: "Owner", label: "Owner", description: "I own this property directly" },
  { value: "Agent", label: "Agent / Broker", description: "I'm listing on behalf of a client" },
  { value: "Builder/Developer", label: "Builder / Developer", description: "I represent a construction company" },
];

export const PROPERTY_TYPES_BY_TRANSACTION = {
  Sale: ["Apartment", "Villa", "Independent House", "Plot", "Farmhouse", "Commercial", "Office Space"],
  Rent: ["Apartment", "Villa", "Independent House", "Commercial", "Office Space"],
  PG: ["PG / Co-living"],
};
