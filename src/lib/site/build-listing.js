// Adapts the post-property wizard's form values into the exact shape used by
// src/data/properties.js, so a freshly published listing renders through the
// same PropertyCard / detail-page components as the seeded catalog with zero
// special-casing.
export function buildListingFromWizard(values, user) {
  const images = (values.images ?? []).map((img) => img.url);
  const bedrooms = values.bedrooms ? Number(values.bedrooms) : null;
  const carpetArea = values.carpetArea ? Number(values.carpetArea) : null;
  const price = values.price ? Number(values.price) : 0;

  return {
    slug: `my-${Date.now()}`,
    title: values.title,
    description: values.description,
    type: values.type,
    listingType: values.listingType,
    price,
    pricePerSqft: carpetArea ? Math.round(price / carpetArea) : null,
    location: { locality: values.locality, city: values.city, state: "India" },
    address: values.address || `${values.locality}, ${values.city}`,
    bedrooms,
    bathrooms: values.bathrooms ? Number(values.bathrooms) : null,
    balconies: values.balconies ? Number(values.balconies) : null,
    carpetArea,
    builtUpArea: values.builtUpArea ? Number(values.builtUpArea) : carpetArea,
    plotArea: values.type === "Plot" ? carpetArea : null,
    floor: values.floor ? Number(values.floor) : null,
    totalFloors: values.totalFloors ? Number(values.totalFloors) : null,
    facing: values.facing || null,
    furnishing: values.furnishing || null,
    parking: !!values.parking,
    amenities: values.amenities ?? [],
    images,
    owner: { name: user?.name || "You", phone: user?.mobile || "", email: "" },
    agent: { name: user?.name || "You", avatar: null },
    views: 0,
    enquiries: 0,
    saves: 0,
    verified: false,
    featured: false,
    rera: values.reraNumber || null,
    sellerType: values.sellerType,
    recentlyPosted: true,
    areaUnit: "sqft",
    reraAuthority: values.reraNumber ? `${values.city} RERA` : null,
    reraStatus: values.reraNumber ? "Registered" : "Not Applicable",
    phoneVerified: true,
    identityVerified: "Pending",
    propertyVerified: "Pending",
  };
}
