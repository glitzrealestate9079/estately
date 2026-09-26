import { PROPERTIES } from "@/data/properties";
import { PROJECTS } from "@/data/projects";
import { LOCATIONS } from "@/data/locations";
import { DEVELOPERS } from "@/data/developers";
import { getCategory } from "@/lib/site/categories";
import {
  derivePossession,
  derivePgGender,
  derivePgRoomType,
  deriveCommercialCategory,
  derivePlotType,
} from "@/lib/site/derived";

// Only listings an admin has actually published should ever reach a visitor —
// mirrors the moderation gate described throughout the product spec.
export const LIVE_PROPERTIES = PROPERTIES.filter((p) => p.status === "Active");

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// The admin's locality price-intelligence dataset (src/data/locations.js) and
// the listing datasets (src/data/properties.js, src/data/projects.js) were
// each seeded independently and don't share city names 1:1 — e.g. listings
// use the shorthand "Delhi NCR" as a city, while the location hierarchy files
// it under state "Delhi NCR" with "New Delhi" as the actual city. This alias
// table is only used when opportunistically attaching richer locality/price
// intelligence; it never affects which listings appear where.
const CITY_NAME_ALIASES = { "Delhi NCR": "New Delhi" };

const FLAT_LOCATIONS_CITIES = LOCATIONS.flatMap((state) =>
  state.cities.map((city) => ({ ...city, stateName: state.name }))
);

function findLocationsCity(cityName) {
  const aliased = CITY_NAME_ALIASES[cityName] ?? cityName;
  return FLAT_LOCATIONS_CITIES.find((c) => c.name === aliased) ?? null;
}

// Post-property wizard's Location step shows the state read-only once a city
// is picked (matches the original prototype's fixed "Rajasthan" field, made
// city-aware since this app spans multiple states).
export function getStateForCity(cityName) {
  return findLocationsCity(cityName)?.stateName ?? null;
}

function findLocationsLocality(cityName, localityName) {
  const city = findLocationsCity(cityName);
  return city?.localities.find((l) => l.name === localityName) ?? null;
}

// ---------------------------------------------------------------------------
// Cities & localities — derived from the listings that actually exist, so
// every public city/locality page is guaranteed to have real inventory.
// Locality intelligence (price/rent trend data) is attached opportunistically
// wherever a matching record exists in the richer LOCATIONS dataset.
// ---------------------------------------------------------------------------

function buildPublicGeography() {
  const cityMap = new Map();
  const localityMap = new Map();

  function touch(cityName, localityName) {
    if (!cityMap.has(cityName)) {
      cityMap.set(cityName, {
        id: slugify(cityName),
        name: cityName,
        propertyCount: 0,
        projectCount: 0,
        localityIds: new Set(),
        intel: findLocationsCity(cityName),
      });
    }
    const cityEntry = cityMap.get(cityName);
    if (!localityName) return cityEntry;

    const localityId = `${cityEntry.id}-${slugify(localityName)}`;
    cityEntry.localityIds.add(localityId);

    if (!localityMap.has(localityId)) {
      localityMap.set(localityId, {
        id: localityId,
        name: localityName,
        cityId: cityEntry.id,
        cityName,
        propertyCount: 0,
        intel: findLocationsLocality(cityName, localityName),
      });
    }
    return cityEntry;
  }

  LIVE_PROPERTIES.forEach((p) => {
    const cityEntry = touch(p.location.city, p.location.locality);
    cityEntry.propertyCount += 1;
    const localityId = `${cityEntry.id}-${slugify(p.location.locality)}`;
    const localityEntry = localityMap.get(localityId);
    if (localityEntry) localityEntry.propertyCount += 1;
  });

  PROJECTS.forEach((p) => {
    const cityEntry = touch(p.city, p.locality);
    cityEntry.projectCount += 1;
  });

  return {
    cities: [...cityMap.values()].map((c) => ({ ...c, localityIds: [...c.localityIds] })),
    localities: [...localityMap.values()],
  };
}

const GEOGRAPHY = buildPublicGeography();
export const PUBLIC_CITIES = GEOGRAPHY.cities;
export const PUBLIC_LOCALITIES = GEOGRAPHY.localities;

export function getCityBySlug(slug) {
  return PUBLIC_CITIES.find((c) => c.id === slug) ?? null;
}

export function getLocalityBySlug(slug) {
  return PUBLIC_LOCALITIES.find((l) => l.id === slug) ?? null;
}

export function getLocalityByName(cityName, localityName) {
  return PUBLIC_LOCALITIES.find((l) => l.cityName === cityName && l.name === localityName) ?? null;
}

export function getLocalitiesForCity(cityId) {
  return PUBLIC_LOCALITIES.filter((l) => l.cityId === cityId);
}

// The admin location dataset has no lat/lng to compute a real distance from,
// so "distance" here is a deterministic, presentation-only pseudo-value
// (stable per locality pair, not used for anything beyond display/sort) —
// same approach as src/lib/site/derived.js's other synthesized fields.
function pseudoDistanceKm(a, b) {
  let h = 0;
  const s = `${a.id}|${b.id}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return 0.8 + (h % 42) / 10;
}

export function getNearbyLocalities(locality, limit = 4) {
  return PUBLIC_LOCALITIES.filter((l) => l.cityId === locality.cityId && l.id !== locality.id)
    .map((l) => ({ ...l, distanceKm: pseudoDistanceKm(locality, l) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export function getPopularCities(limit = 8) {
  return [...PUBLIC_CITIES].sort((a, b) => b.propertyCount + b.projectCount - (a.propertyCount + a.projectCount)).slice(0, limit);
}

export function getPopularLocalities(limit = 8) {
  return [...PUBLIC_LOCALITIES].sort((a, b) => b.propertyCount - a.propertyCount).slice(0, limit);
}

// Grouped, ranked suggestions for the header/hero location search box —
// mirrors the spec's LOCALITY / CITY / PROJECT grouping.
export function searchLocations(query) {
  const q = query.trim().toLowerCase();
  if (!q) return { localities: [], cities: [], projects: [] };

  const localities = PUBLIC_LOCALITIES.filter((l) => l.name.toLowerCase().includes(q)).slice(0, 5);
  const cities = PUBLIC_CITIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4);
  const projects = PROJECTS.filter(
    (p) => p.projectName.toLowerCase().includes(q) || p.locality.toLowerCase().includes(q)
  ).slice(0, 4);

  return { localities, cities, projects };
}

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

export function getPropertiesForCategory(categoryKey) {
  const category = getCategory(categoryKey);
  return LIVE_PROPERTIES.filter(category.matches);
}

export function getPropertyBySlug(slug) {
  return PROPERTIES.find((p) => p.slug === slug && p.status !== "Draft") ?? null;
}

export function getRelatedProperties(property, limit = 4) {
  return LIVE_PROPERTIES.filter(
    (p) => p.id !== property.id && p.location.city === property.location.city && p.type === property.type
  ).slice(0, limit);
}

export function getFeaturedProperties(limit = 6) {
  return LIVE_PROPERTIES.filter((p) => p.featured).slice(0, limit);
}

export function getRecentProperties(limit = 8) {
  return [...LIVE_PROPERTIES].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
}

export function getOwnerProperties(limit = 6) {
  return LIVE_PROPERTIES.filter((p) => p.sellerType === "Owner").slice(0, limit);
}

export function getPropertiesForCity(cityName, limit) {
  const list = LIVE_PROPERTIES.filter((p) => p.location.city === cityName);
  return limit ? list.slice(0, limit) : list;
}

export function getPropertiesForLocality(cityName, localityName, limit) {
  const list = LIVE_PROPERTIES.filter((p) => p.location.city === cityName && p.location.locality === localityName);
  return limit ? list.slice(0, limit) : list;
}

const SORTERS = {
  relevance: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.views - a.views,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "area-asc": (a, b) => (a.carpetArea ?? 0) - (b.carpetArea ?? 0),
  "area-desc": (a, b) => (b.carpetArea ?? 0) - (a.carpetArea ?? 0),
};

export function sortProperties(list, sortKey = "relevance") {
  const sorter = SORTERS[sortKey] ?? SORTERS.relevance;
  return [...list].sort(sorter);
}

// `filters` shape: { city, locality, propertyType, bhk, minPrice, maxPrice,
// minArea, maxArea, furnishing, parking, verified, ownerOnly, rera, gender,
// roomType, commercialCategory, possession, listingType, plotType }.
// `city`/`locality` are plain display names (matching src/data/properties.js),
// not slugs.
export function applyFilters(list, filters = {}) {
  return list.filter((p) => {
    if (filters.q) {
      const q = filters.q.trim().toLowerCase();
      if (q && !`${p.location.city} ${p.location.locality} ${p.title}`.toLowerCase().includes(q)) return false;
    }
    if (filters.city && p.location.city !== filters.city) return false;
    if (filters.locality && p.location.locality !== filters.locality) return false;
    if (filters.propertyType && filters.propertyType !== "any" && p.type !== filters.propertyType) return false;
    if (filters.bhk && filters.bhk !== "any") {
      const wanted = Number(filters.bhk);
      if (wanted >= 4) {
        if (!p.bedrooms || p.bedrooms < 4) return false;
      } else if (p.bedrooms !== wanted) return false;
    }
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (filters.minArea && (p.carpetArea ?? 0) < Number(filters.minArea)) return false;
    if (filters.maxArea && (p.carpetArea ?? 0) > Number(filters.maxArea)) return false;
    if (filters.furnishing && filters.furnishing !== "any" && p.furnishing !== filters.furnishing) return false;
    if (filters.parking === true && !p.parking) return false;
    if (filters.verified === true && !p.verified) return false;
    if (filters.rera === true && !p.rera) return false;
    if (filters.ownerOnly === true && p.sellerType !== "Owner") return false;
    if (filters.gender && filters.gender !== "any" && derivePgGender(p) !== filters.gender) return false;
    if (filters.roomType && filters.roomType !== "any" && derivePgRoomType(p) !== filters.roomType) return false;
    if (
      filters.commercialCategory &&
      filters.commercialCategory !== "any" &&
      deriveCommercialCategory(p) !== filters.commercialCategory
    )
      return false;
    if (filters.possession && filters.possession !== "any" && derivePossession(p) !== filters.possession) return false;
    if (filters.listingType && filters.listingType !== "any" && p.listingType !== filters.listingType) return false;
    if (filters.plotType && filters.plotType !== "any" && derivePlotType(p) !== filters.plotType) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug) ?? null;
}

export function applyProjectFilters(list, filters = {}) {
  return list.filter((p) => {
    if (filters.q) {
      const q = filters.q.trim().toLowerCase();
      if (q && !`${p.city} ${p.locality} ${p.projectName}`.toLowerCase().includes(q)) return false;
    }
    if (filters.city && p.city !== filters.city) return false;
    if (filters.locality && p.locality !== filters.locality) return false;
    if (filters.status && filters.status !== "any" && p.status !== filters.status) return false;
    if (filters.propertyType && filters.propertyType !== "any" && p.projectType !== filters.propertyType) return false;
    if (filters.minPrice && p.startingPrice < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.startingPrice > Number(filters.maxPrice)) return false;
    if (filters.rera === true && !p.reraNumber) return false;
    return true;
  });
}

const PROJECT_SORTERS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  "price-asc": (a, b) => a.startingPrice - b.startingPrice,
  "price-desc": (a, b) => b.startingPrice - a.startingPrice,
  possession: (a, b) => new Date(a.possessionDate ?? 0) - new Date(b.possessionDate ?? 0),
};

export function sortProjects(list, sortKey = "newest") {
  const sorter = PROJECT_SORTERS[sortKey] ?? PROJECT_SORTERS.newest;
  return [...list].sort(sorter);
}

export function getRelatedProjects(project, limit = 3) {
  return PROJECTS.filter((p) => p.id !== project.id && p.city === project.city).slice(0, limit);
}

export function getDeveloperByName(name) {
  return DEVELOPERS.find((d) => d.name === name) ?? null;
}

export const PROJECT_TYPE_OPTIONS = [...new Set(PROJECTS.map((p) => p.projectType))];
export const PROJECT_STATUS_OPTIONS = [...new Set(PROJECTS.map((p) => p.status))];
