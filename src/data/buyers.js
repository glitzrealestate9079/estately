// Mock data for the Buyers & Tenants module. Deterministic (no Math.random/Date.now).

const RAW_BUYERS = [
  { name: "Aditya Malhotra", type: "Buyer", interestedPropertyType: "Apartment", preferredLocation: "Jaipur", status: "New" },
  { name: "Priya Chatterjee", type: "Tenant", interestedPropertyType: "Apartment", preferredLocation: "Bengaluru", status: "Active" },
  { name: "Rohit Saxena", type: "Buyer", interestedPropertyType: "Villa", preferredLocation: "Gurugram", status: "Converted" },
  { name: "Kavya Nair", type: "Tenant", interestedPropertyType: "PG / Co-living", preferredLocation: "Bengaluru", status: "Active" },
  { name: "Manish Agrawal", type: "Buyer", interestedPropertyType: "Independent House", preferredLocation: "Pune", status: "New" },
  { name: "Sneha Kulkarni", type: "Buyer", interestedPropertyType: "Plot", preferredLocation: "Nashik", status: "Active" },
  { name: "Arvind Menon", type: "Tenant", interestedPropertyType: "Office Space", preferredLocation: "Chennai", status: "Active" },
  { name: "Divya Iyer", type: "Buyer", interestedPropertyType: "Apartment", preferredLocation: "Hyderabad", status: "Converted" },
  { name: "Karan Thakur", type: "Tenant", interestedPropertyType: "Apartment", preferredLocation: "Noida", status: "New" },
  { name: "Ritu Bhatia", type: "Buyer", interestedPropertyType: "Villa", preferredLocation: "Mumbai", status: "Active" },
  { name: "Farhan Sheikh", type: "Buyer", interestedPropertyType: "Commercial", preferredLocation: "Ahmedabad", status: "New" },
  { name: "Nandini Rao", type: "Tenant", interestedPropertyType: "PG / Co-living", preferredLocation: "Pune", status: "Active" },
  { name: "Siddharth Oberoi", type: "Buyer", interestedPropertyType: "Farmhouse", preferredLocation: "Jaipur", status: "Converted" },
  { name: "Ishita Bose", type: "Buyer", interestedPropertyType: "Apartment", preferredLocation: "Kolkata", status: "New" },
];

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

export const BUYERS = RAW_BUYERS.map((b, index) => {
  const id = `BYR-${1000 + index}`;
  const budgetBase = b.type === "Tenant" ? 15000 : 3000000;
  const budgetSpread = b.type === "Tenant" ? 45000 : 65000000;
  const budget = budgetBase + pseudoRandom(index + 5, budgetSpread);
  const savedPropertiesCount = pseudoRandom(index + 11, 22);
  const day = 1 + (index % 27);
  const month = 1 + (index % 12);
  const year = 2024 + (index % 2);

  return {
    id,
    name: b.name,
    phone: `+91 9${(700000000 + index * 733).toString().slice(0, 9)}`,
    email: `${b.name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
    type: b.type,
    interestedPropertyType: b.interestedPropertyType,
    budget,
    preferredLocation: b.preferredLocation,
    status: b.status,
    savedPropertiesCount,
    createdDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
});

export function getBuyerById(id) {
  return BUYERS.find((b) => b.id === id);
}

export const BUYER_LOCATIONS = [...new Set(BUYERS.map((b) => b.preferredLocation))];
