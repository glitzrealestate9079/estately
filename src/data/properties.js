import { imageForProperty } from "@/data/property-images";
import { addDays } from "@/lib/utils";
import { VERIFICATION_VALIDITY_DAYS } from "@/schemas/propertySchema";

const RAW_PROPERTIES = [
  { title: "Premium 3 BHK Apartment", type: "Apartment", listingType: "Sale", city: "Jaipur", locality: "Malviya Nagar", price: 12500000, beds: 3, baths: 3, area: 1850, status: "Active", featured: true, verified: true, owner: "Ramesh Agarwal", agent: "Kavita Singh" },
  { title: "Luxury 4 BHK Villa with Private Pool", type: "Villa", listingType: "Sale", city: "Gurugram", locality: "Golf Course Road", price: 45000000, beds: 4, baths: 5, area: 4200, status: "Active", featured: true, verified: true, owner: "Amrapali Estates", agent: "Rahul Sharma" },
  { title: "Modern 2 BHK Apartment, Ready to Move", type: "Apartment", listingType: "Rent", city: "Bengaluru", locality: "Whitefield", price: 42000, beds: 2, baths: 2, area: 1120, status: "Active", featured: false, verified: true, owner: "Suresh Kumar", agent: "Kavita Singh" },
  { title: "Spacious 3 BHK Independent House", type: "Independent House", listingType: "Sale", city: "Pune", locality: "Baner", price: 18500000, beds: 3, baths: 3, area: 2400, status: "Pending", featured: false, verified: false, owner: "Meena Deshpande", agent: "Arjun Nair" },
  { title: "Commercial Office Space, Prime Location", type: "Office Space", listingType: "Rent", city: "Mumbai", locality: "Bandra Kurla Complex", price: 350000, beds: null, baths: 2, area: 3200, status: "Active", featured: true, verified: true, owner: "Horizon Developers", agent: "Rahul Sharma" },
  { title: "Elegant 5 BHK Villa, Gated Community", type: "Villa", listingType: "Sale", city: "Hyderabad", locality: "Jubilee Hills", price: 68000000, beds: 5, baths: 6, area: 5600, status: "Active", featured: true, verified: true, owner: "Vikram Reddy", agent: "Sneha Pillai" },
  { title: "Affordable 1 BHK Apartment", type: "Apartment", listingType: "Sale", city: "Noida", locality: "Sector 62", price: 3800000, beds: 1, baths: 1, area: 620, status: "Draft", featured: false, verified: false, owner: "Anita Verma", agent: "Arjun Nair" },
  { title: "Residential Plot near IT Corridor", type: "Plot", listingType: "Sale", city: "Chennai", locality: "OMR", price: 9500000, beds: null, baths: null, area: 2400, status: "Active", featured: false, verified: true, owner: "Chennai Land Corp", agent: "Sneha Pillai" },
  { title: "Co-living PG for Working Professionals", type: "PG / Co-living", listingType: "PG", city: "Bengaluru", locality: "Koramangala", price: 18500, beds: 1, baths: 1, area: 220, status: "Active", featured: false, verified: true, owner: "StayEasy Homes", agent: "Kavita Singh" },
  { title: "Retail Showroom on Main Highway", type: "Commercial", listingType: "Sale", city: "Ahmedabad", locality: "SG Highway", price: 28000000, beds: null, baths: 2, area: 1800, status: "Pending", featured: false, verified: false, owner: "Patel Enterprises", agent: "Rahul Sharma" },
  { title: "Charming 3 BHK Apartment with Garden View", type: "Apartment", listingType: "Sale", city: "Pune", locality: "Kharadi", price: 11200000, beds: 3, baths: 2, area: 1580, status: "Sold", featured: false, verified: true, owner: "Deepak Joshi", agent: "Arjun Nair" },
  { title: "Farmhouse Retreat with Orchard", type: "Farmhouse", listingType: "Sale", city: "Jaipur", locality: "Chandwaji", price: 21000000, beds: 4, baths: 4, area: 8500, status: "Active", featured: true, verified: true, owner: "Rajasthan Farms LLP", agent: "Sneha Pillai" },
  { title: "Budget 2 BHK Apartment near Metro", type: "Apartment", listingType: "Rent", city: "Delhi NCR", locality: "Dwarka", price: 24000, beds: 2, baths: 2, area: 950, status: "Active", featured: false, verified: true, owner: "Sunil Kapoor", agent: "Kavita Singh" },
  { title: "Independent House with Terrace Garden", type: "Independent House", listingType: "Sale", city: "Jaipur", locality: "Vaishali Nagar", price: 15800000, beds: 3, baths: 3, area: 2100, status: "Rejected", featured: false, verified: false, owner: "Manoj Sharma", agent: "Rahul Sharma" },
  { title: "Sea-facing 4 BHK Luxury Apartment", type: "Apartment", listingType: "Sale", city: "Mumbai", locality: "Worli", price: 95000000, beds: 4, baths: 4, area: 3100, status: "Active", featured: true, verified: true, owner: "Coastal Realty", agent: "Sneha Pillai" },
  { title: "Compact Studio Apartment", type: "Apartment", listingType: "Rent", city: "Bengaluru", locality: "Indiranagar", price: 28000, beds: 1, baths: 1, area: 480, status: "Active", featured: false, verified: true, owner: "Nikhil Rao", agent: "Arjun Nair" },
  { title: "Premium Villa in Gated Township", type: "Villa", listingType: "Sale", city: "Pune", locality: "Hinjewadi", price: 32000000, beds: 4, baths: 4, area: 3600, status: "Pending", featured: false, verified: false, owner: "Sahil Mehta", agent: "Kavita Singh" },
  { title: "Grade-A Office Space, Furnished", type: "Office Space", listingType: "Rent", city: "Gurugram", locality: "Cyber City", price: 480000, beds: null, baths: 3, area: 4800, status: "Active", featured: true, verified: true, owner: "Horizon Developers", agent: "Rahul Sharma" },
  { title: "Corner Plot in Developing Sector", type: "Plot", listingType: "Sale", city: "Noida", locality: "Sector 150", price: 14500000, beds: null, baths: null, area: 3000, status: "Active", featured: false, verified: true, owner: "Yamuna Realtors", agent: "Sneha Pillai" },
  { title: "2 BHK Apartment, Newly Renovated", type: "Apartment", listingType: "Rent", city: "Hyderabad", locality: "Gachibowli", price: 32000, beds: 2, baths: 2, area: 1150, status: "Rented", featured: false, verified: true, owner: "Lakshmi Rao", agent: "Kavita Singh" },
  { title: "Boutique Villa with Home Theatre", type: "Villa", listingType: "Sale", city: "Chennai", locality: "ECR", price: 52000000, beds: 5, baths: 5, area: 4800, status: "Active", featured: true, verified: true, owner: "Marina Estates", agent: "Arjun Nair" },
  { title: "PG for Women, Fully Furnished", type: "PG / Co-living", listingType: "PG", city: "Delhi NCR", locality: "Lajpat Nagar", price: 15000, beds: 1, baths: 1, area: 180, status: "Active", featured: false, verified: true, owner: "SafeStay PGs", agent: "Rahul Sharma" },
  { title: "Duplex Penthouse with Skyline View", type: "Apartment", listingType: "Sale", city: "Mumbai", locality: "Lower Parel", price: 78000000, beds: 4, baths: 5, area: 3400, status: "Draft", featured: true, verified: false, owner: "Skyline Towers Pvt Ltd", agent: "Sneha Pillai" },
  { title: "Commercial Land near Expressway", type: "Plot", listingType: "Sale", city: "Pune", locality: "Chakan", price: 36000000, beds: null, baths: null, area: 12000, status: "Pending", featured: false, verified: false, owner: "Pune Infra Ventures", agent: "Kavita Singh" },
  { title: "3 BHK Apartment with Clubhouse Access", type: "Apartment", listingType: "Sale", city: "Bengaluru", locality: "Sarjapur Road", price: 14800000, beds: 3, baths: 3, area: 1720, status: "Active", featured: false, verified: true, owner: "Prestige Homes Pvt Ltd", agent: "Arjun Nair" },
  { title: "Heritage Bungalow, Fully Restored", type: "Independent House", listingType: "Sale", city: "Jaipur", locality: "Civil Lines", price: 42000000, beds: 5, baths: 5, area: 5200, status: "Active", featured: true, verified: true, owner: "Heritage Homes Rajasthan", agent: "Rahul Sharma" },
];

const AMENITY_POOL = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Lift",
  "Security",
  "Power Backup",
  "Garden",
  "Club House",
  "CCTV",
];

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

const SELLER_TYPES = ["Owner", "Agent", "Builder/Developer"];

export const PROPERTIES = RAW_PROPERTIES.map((p, index) => {
  const id = `PR-${1000 + index}`;
  const views = 180 + pseudoRandom(index + 1, 4200);
  const enquiries = 4 + pseudoRandom(index + 7, 96);
  const saves = 2 + pseudoRandom(index + 13, 58);
  const amenityCount = 3 + (index % 5);
  const amenities = Array.from({ length: amenityCount }, (_, i) => AMENITY_POOL[(index + i) % AMENITY_POOL.length]);
  const day = 1 + (index % 27);
  const month = 1 + (index % 9);
  const createdAt = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return {
    id,
    slug: id.toLowerCase(),
    title: p.title,
    description: `${p.title} located in ${p.locality}, ${p.city}. Thoughtfully designed with modern finishes, ample natural light, and excellent connectivity to major hubs. A great fit for end-users and investors alike.`,
    type: p.type,
    listingType: p.listingType,
    status: p.status,
    price: p.price,
    pricePerSqft: Math.round(p.price / (p.area || 1000)),
    location: { locality: p.locality, city: p.city, state: "India" },
    address: `${p.locality}, ${p.city}`,
    bedrooms: p.beds,
    bathrooms: p.baths,
    balconies: p.beds ? Math.max(1, Math.min(3, p.beds - 1)) : null,
    carpetArea: p.area,
    builtUpArea: Math.round(p.area * 1.12),
    plotArea: p.type === "Plot" || p.type === "Farmhouse" ? p.area : null,
    floor: p.beds ? 1 + (index % 12) : null,
    totalFloors: p.beds ? 14 : null,
    facing: ["North", "South", "East", "West", "North-East"][index % 5],
    furnishing: ["Unfurnished", "Semi-Furnished", "Fully Furnished"][index % 3],
    parking: index % 4 !== 0,
    amenities,
    images: Array.from({ length: 4 }, (_, i) => imageForProperty(p.type, index + i)),
    owner: {
      name: p.owner,
      phone: `+91 9${(800000000 + index * 137).toString().slice(0, 9)}`,
      email: `${p.owner.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
    },
    agent: { name: p.agent, avatar: `https://i.pravatar.cc/80?img=${(index % 60) + 1}` },
    views,
    enquiries,
    saves,
    verified: p.verified,
    featured: p.featured,
    rera: p.verified ? `RJ/${2022 + (index % 3)}/${1000 + index * 3}` : null,
    sellerType: SELLER_TYPES[index % 3],
    recentlyPosted: index % 7 === 0,
    areaUnit: "sqft",
    reraAuthority: p.verified ? `${p.city} RERA` : null,
    reraStatus: p.verified ? "Registered" : "Not Applicable",
    phoneVerified: true,
    identityVerified: p.verified ? "Verified" : "Pending",
    propertyVerified: p.verified ? "Verified" : "Pending",
    // Verified listings were stamped valid for VERIFICATION_VALIDITY_DAYS from
    // createdAt — some of these will already be in the past, which is what
    // exercises the staleness indicator in VerificationChecklist.
    verifiedUntil: p.verified ? addDays(createdAt, VERIFICATION_VALIDITY_DAYS).toISOString().slice(0, 10) : null,
    createdAt,
    updatedAt: createdAt,
  };
});

export function getPropertyById(id) {
  return PROPERTIES.find((p) => p.id === id);
}

export const TOP_PERFORMING_PROPERTIES = [...PROPERTIES]
  .sort((a, b) => b.views - a.views)
  .slice(0, 6);

export const PENDING_APPROVALS = PROPERTIES.filter((p) => p.status === "Pending");
