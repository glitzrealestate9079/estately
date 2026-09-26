import {
  daysAgo,
  derivePossession,
  derivePgGender,
  derivePgOccupancy,
  derivePgTenantType,
  derivePgAmenityFlags,
  derivePgDetails,
  deriveCommercialCategory,
  deriveCommercialSpecs,
  deriveConnectivity,
  deriveRentTenant,
  deriveRentLease,
  deriveAvailability,
  derivePlotApproval,
  derivePlotType,
  derivePlotRoadWidth,
  derivePlotFlags,
  derivePlotDims,
  derivePropertyAge,
  deriveMaintenance,
  deriveSellerStats,
  deriveNearby,
  deriveEmailVerified,
} from "@/lib/site/derived";

// Reshapes a real PROPERTIES row (src/data/properties.js — shared with
// admin, never modified here) into the flat field vocabulary the ported
// HomePlace template's card/detail components expect (p.cat, p.bhk, p.occ,
// ...). Keeping this mapping in one place means every ported component can
// be a near-verbatim port of the prototype's own markup/logic.
export function toTemplateProperty(property, categoryKey) {
  const sellerStats = deriveSellerStats(property);
  const base = {
    id: property.id,
    slug: property.slug,
    cat: categoryKey,
    title: property.title,
    description: property.description,
    loc: property.location.locality,
    sub: property.subLocality || null,
    city: property.location.city,
    images: property.images,
    bathrooms: property.bathrooms,
    balcony: property.balconies,
    floor: property.floor ?? 0,
    totalFloors: property.totalFloors ?? 1,
    amenities: property.amenities,
    views: property.views,
    seller: {
      name: property.owner.name,
      type: property.sellerType.startsWith("Builder") ? "Builder" : property.sellerType,
      since: sellerStats.since,
      listings: sellerStats.listings,
      responds: sellerStats.responds,
    },
    verif: {
      location: property.propertyVerified === "Verified",
      docs: property.verified,
      identity: property.identityVerified === "Verified",
      phone: property.phoneVerified,
      email: deriveEmailVerified(property),
    },
    updated: daysAgo(property.updatedAt),
    rera: property.rera,
    nearby: deriveNearby(property),
    _property: property,
  };

  switch (categoryKey) {
    case "buy":
      return {
        ...base,
        type: property.type,
        bhk: property.bedrooms,
        price: property.price,
        area: property.carpetArea,
        areaType: "Carpet area",
        furnishing: property.furnishing,
        possession: derivePossession(property),
        facing: property.facing,
        age: derivePropertyAge(property),
        maintenance: deriveMaintenance(property),
      };
    case "rent":
      return {
        ...base,
        type: property.type,
        bhk: property.bedrooms,
        rent: property.price,
        deposit: property.securityDeposit || property.price * 2,
        furnishing: property.furnishing,
        parking: property.parking ? 1 : 0,
        tenant: deriveRentTenant(property),
        lease: deriveRentLease(property),
        available: deriveAvailability(property),
        area: property.carpetArea,
        facing: property.facing,
        age: derivePropertyAge(property),
        maintenance: deriveMaintenance(property),
      };
    case "pg": {
      const occ = derivePgOccupancy(property);
      const flags = derivePgAmenityFlags(property);
      const pgDetails = derivePgDetails(property);
      return {
        ...base,
        rent: property.price,
        occ,
        gender: derivePgGender(property),
        tenantType: derivePgTenantType(property),
        food: flags.food ? "Meals included" : "No food",
        wifi: flags.wifi,
        ac: flags.ac,
        bath: flags.bath,
        available: deriveAvailability(property),
        ...pgDetails,
      };
    }
    case "commercial": {
      const ctype = deriveCommercialCategory(property);
      const specs = deriveCommercialSpecs(property, ctype);
      return {
        ...base,
        ctype,
        txn: property.listingType === "Rent" ? "rent" : "sale",
        price: property.price,
        area: property.carpetArea ?? property.builtUpArea,
        furnishing: property.furnishing,
        parking: property.parking ? 4 : 0,
        features: property.amenities,
        connectivity: deriveConnectivity(property),
        perSeat: false,
        ...specs,
      };
    }
    case "plot": {
      const flags = derivePlotFlags(property);
      const area = property.plotArea ?? property.carpetArea;
      return {
        ...base,
        price: property.price,
        area,
        orig: { value: area, unit: "sq.ft" },
        plotType: derivePlotType(property),
        facing: property.facing,
        roadWidth: derivePlotRoadWidth(property),
        approval: derivePlotApproval(property),
        corner: flags.corner,
        boundary: flags.boundary,
        dims: derivePlotDims(property),
      };
    }
    default:
      return base;
  }
}
