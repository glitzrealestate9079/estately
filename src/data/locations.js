import { INDIAN_STATES } from "@/lib/constants";

// Deterministic hierarchy: States (from INDIAN_STATES) -> Cities -> Localities.
// Property counts are derived from a seeded pseudo-random walk (no Math.random / Date.now)
// so server and client renders always agree.

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

const STATE_CITY_MAP = {
  Rajasthan: [
    { city: "Jaipur", localities: ["Malviya Nagar", "Vaishali Nagar", "C-Scheme", "Mansarovar", "Civil Lines"] },
    { city: "Udaipur", localities: ["Fatehpura", "Bhuwana", "Sector 14"] },
    { city: "Jodhpur", localities: ["Ratanada", "Shastri Nagar", "Paota"] },
  ],
  Maharashtra: [
    { city: "Mumbai", localities: ["Bandra", "Andheri", "Worli", "Lower Parel", "Powai"] },
    { city: "Pune", localities: ["Baner", "Kharadi", "Hinjewadi", "Koregaon Park"] },
    { city: "Nagpur", localities: ["Dharampeth", "Sadar", "Civil Lines"] },
  ],
  Karnataka: [
    { city: "Bengaluru", localities: ["Whitefield", "Koramangala", "Indiranagar", "Sarjapur Road", "Electronic City"] },
    { city: "Mysuru", localities: ["Vijayanagar", "Gokulam", "Jayalakshmipuram"] },
  ],
  "Delhi NCR": [
    { city: "New Delhi", localities: ["Dwarka", "Lajpat Nagar", "Rohini", "Saket"] },
    { city: "Gurugram", localities: ["Golf Course Road", "Cyber City", "Sohna Road", "Sector 57"] },
    { city: "Noida", localities: ["Sector 62", "Sector 150", "Sector 18"] },
  ],
  Telangana: [
    { city: "Hyderabad", localities: ["Gachibowli", "Jubilee Hills", "Banjara Hills", "Kondapur"] },
    { city: "Warangal", localities: ["Hanamkonda", "Kazipet"] },
  ],
  "Tamil Nadu": [
    { city: "Chennai", localities: ["OMR", "ECR", "Adyar", "T Nagar"] },
    { city: "Coimbatore", localities: ["RS Puram", "Saibaba Colony"] },
  ],
  Gujarat: [
    { city: "Ahmedabad", localities: ["SG Highway", "Satellite", "Bodakdev"] },
    { city: "Surat", localities: ["Adajan", "Vesu"] },
  ],
  "West Bengal": [
    { city: "Kolkata", localities: ["Salt Lake", "New Town", "Park Street", "Ballygunge"] },
    { city: "Howrah", localities: ["Shibpur", "Santragachi"] },
  ],
};

let seedCounter = 0;

export const LOCATIONS = INDIAN_STATES.map((stateName) => {
  const stateId = slugify(stateName);
  const cityConfigs = STATE_CITY_MAP[stateName] ?? [];

  const cities = cityConfigs.map(({ city, localities }) => {
    const cityId = `${stateId}-${slugify(city)}`;
    const localityRows = localities.map((localityName) => {
      seedCounter += 1;
      const propertyCount = 32 + pseudoRandom(seedCounter, 420);
      const avgPricePerSqft = 4200 + pseudoRandom(seedCounter, 7800);
      const rentRangeMin = 12000 + pseudoRandom(seedCounter, 18000);
      const rentRangeMax = rentRangeMin + 8000 + pseudoRandom(seedCounter, 22000);
      return {
        id: `${cityId}-${slugify(localityName)}`,
        name: localityName,
        propertyCount,
        seoTitle: `${localityName} Properties in ${city} | Buy, Sell & Rent`,
        seoDescription: `Explore ${propertyCount} properties in ${localityName}, ${city}, with pricing, rent trends, and market insights updated for buyers, sellers, and tenants.`,
        avgPricePerSqft,
        rentRangeMin,
        rentRangeMax,
        dataPeriod: "Q3 2026",
        lastUpdated: "2026-09-01",
      };
    });
    const cityPropertyCount = localityRows.reduce((sum, l) => sum + l.propertyCount, 0);
    return { id: cityId, name: city, propertyCount: cityPropertyCount, localities: localityRows };
  });

  const statePropertyCount = cities.reduce((sum, c) => sum + c.propertyCount, 0);
  return { id: stateId, name: stateName, propertyCount: statePropertyCount, cities };
});
