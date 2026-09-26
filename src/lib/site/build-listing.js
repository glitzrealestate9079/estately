import { kindFor } from "@/schemas/site/postPropertySchema";

function num(v) {
  return v === "" || v == null ? null : Number(v);
}

// Adapts the post-property wizard's form values into the exact shape used by
// src/data/properties.js, so a freshly published listing renders through the
// same PropertyCard / detail-page components as the seeded catalog with zero
// special-casing. Fields the admin schema also models (plotArea/areaUnit,
// seatingCapacity/washrooms, sharingType/genderPreference/mealPlan,
// latitude/longitude) use those same names; fields with no admin equivalent
// (plot dimensions, commercial sub-type specs, PG tenant/housekeeping
// details) are carried through anyway — src/lib/site/derived.js prefers them
// over its seeded fallbacks (see property-mapper.js/derived.js) whenever
// they're present, which they only ever are on wizard-created listings.
export function buildListingFromWizard(values, user) {
  const kind = kindFor(values);
  const images = (values.images ?? []).filter((img) => img.status !== "failed").map((img) => img.url);
  const bedrooms = num(values.bedrooms);
  const carpetArea = num(values.carpetArea);
  const plotArea = num(values.plotArea);
  const price = num(values.price) ?? 0;
  const area = kind === "plot" ? plotArea : carpetArea;

  return {
    slug: `my-${Date.now()}`,
    title: values.title,
    description: values.description,
    type: values.type,
    listingType: values.listingType,
    price,
    pricePerSqft: num(values.pricePerSqft) ?? (area ? Math.round(price / area) : null),
    location: { locality: values.locality, city: values.city, state: "India" },
    subLocality: values.subLocality || null,
    societyName: values.societyName || null,
    landmark: values.landmark || null,
    address: values.address || `${values.locality}, ${values.city}`,
    latitude: num(values.latitude),
    longitude: num(values.longitude),
    bedrooms,
    bathrooms: num(values.bathrooms),
    balconies: num(values.balconies),
    carpetArea,
    builtUpArea: num(values.builtUpArea) ?? carpetArea,
    plotArea,
    areaUnit: values.areaUnit || "sqft",
    floor: num(values.floor),
    totalFloors: num(values.totalFloors),
    facing: values.facing || null,
    furnishing: values.furnishing || null,
    propertyAge: values.propertyAge || null,
    parking: !!values.parking,

    // Plot-specific (no admin schema equivalent — see derived.js's
    // derivePlotType/derivePlotRoadWidth/derivePlotFlags/derivePlotDims)
    plotType: values.plotType || null,
    plotIrregular: !!values.plotIrregular,
    plotLength: num(values.plotLength),
    plotWidth: num(values.plotWidth),
    roadWidth: num(values.roadWidth),
    approval: values.approval || null,
    corner: !!values.corner,
    boundary: !!values.boundary,

    // Commercial-specific (seatingCapacity/washrooms mirror the admin
    // schema's own field names; frontage/ceilingHeight have no admin
    // equivalent — see derived.js's deriveCommercialSpecs)
    commercialCategory: values.commercialCategory || null,
    seatingCapacity: num(values.seatingCapacity),
    washrooms: num(values.washrooms),
    frontage: num(values.frontage),
    ceilingHeight: num(values.ceilingHeight),

    // PG-specific (sharingType/genderPreference/mealPlan mirror the admin
    // schema's own field names; the rest have no admin equivalent)
    sharingType: values.sharingType || null,
    genderPreference: values.genderPreference || null,
    mealPlan: values.mealPlan || null,
    tenantPreference: values.tenantPreference || null,
    wifi: !!values.wifi,
    ac: !!values.ac,
    attachedBath: !!values.attachedBath,
    noticePeriod: values.noticePeriod || null,
    housekeeping: values.housekeeping || null,
    availableFrom: values.availableFrom || null,

    // Rent-specific
    leaseDuration: values.leaseDuration || null,

    amenities: values.amenities ?? [],
    images,
    video: values.video || null,
    floorPlan: values.floorPlan || null,
    owner: { name: user?.name || "You", phone: user?.mobile || "", email: "" },
    agent: { name: user?.name || "You", avatar: null },
    views: 0,
    enquiries: 0,
    saves: 0,
    featured: false,
    rera: values.reraNumber || null,
    sellerType: values.sellerType,
    agencyName: values.agencyName || null,
    recentlyPosted: true,
    maintenance: num(values.maintenance),
    securityDeposit: num(values.securityDeposit),
    negotiable: !!values.negotiable,
    reraAuthority: values.reraNumber ? `${values.city} RERA` : null,
    reraStatus: values.reraNumber ? "Registered" : "Not Applicable",
    phoneVerified: true,
    identityVerified: values.identityUploaded ? "Verified" : "Pending",
    propertyVerified: values.locationConfirmed ? "Verified" : "Pending",
    verified: !!values.docsUploaded,
  };
}

// Builder/Developer → "List New Project" branch produces a project-shaped
// object (src/data/projects.js's shape), not a property — projects and
// properties are entirely separate admin datasets/pages, so this never
// touches buildListingFromWizard's output.
const PROJECT_TYPE_BY_UNIT_TYPE = { Villa: "Villa Township", Plot: "Plotted Development" };

export function buildProjectFromWizard(values, user) {
  const unitTypes = (values.unitTypes ?? []).filter((u) => u.name);
  const minPrice = num(values.minPrice) ?? (unitTypes.length ? Math.min(...unitTypes.map((u) => num(u.price) ?? Infinity)) : 0);
  const maxPrice = num(values.maxPrice) ?? (unitTypes.length ? Math.max(...unitTypes.map((u) => num(u.price) ?? 0)) : 0);

  return {
    id: `MYPRJ-${Date.now()}`,
    slug: `my-project-${Date.now()}`,
    projectName: values.projectName,
    developer: user?.name || "You",
    projectType: PROJECT_TYPE_BY_UNIT_TYPE[values.type] ?? "Residential",
    status: "Upcoming",
    city: values.city,
    locality: values.locality,
    images: (values.images ?? []).filter((img) => img.status !== "failed").map((img) => img.url),
    reraNumber: values.reraNumber || null,
    startingPrice: minPrice,
    priceRangeMax: maxPrice,
    totalUnits: num(values.totalUnitsCount) ?? unitTypes.reduce((sum, u) => sum + (num(u.available) || 0), 0),
    availableUnits: num(values.totalUnitsCount),
    possessionDate: values.possessionDate || null,
    amenities: values.amenities ?? [],
    description: values.description,
    createdAt: new Date().toISOString().slice(0, 10),
    towers: num(values.towers),
    acres: num(values.acres),
    unitTypes: unitTypes.map((u) => ({ name: u.name, size: num(u.size), carpet: Math.round((num(u.size) ?? 0) * 0.85), price: num(u.price), available: num(u.available) })),
  };
}
