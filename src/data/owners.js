// Mock data for the Owners module. Deterministic (no Math.random/Date.now).

const RAW_OWNERS = [
  { name: "Ramesh Agarwal", city: "Jaipur", verificationStatus: "Verified" },
  { name: "Amrapali Estates", city: "Gurugram", verificationStatus: "Verified" },
  { name: "Suresh Kumar", city: "Bengaluru", verificationStatus: "Verified" },
  { name: "Meena Deshpande", city: "Pune", verificationStatus: "Unverified" },
  { name: "Horizon Developers", city: "Mumbai", verificationStatus: "Verified" },
  { name: "Vikram Reddy", city: "Hyderabad", verificationStatus: "Verified" },
  { name: "Anita Verma", city: "Noida", verificationStatus: "Unverified" },
  { name: "Chennai Land Corp", city: "Chennai", verificationStatus: "Verified" },
  { name: "StayEasy Homes", city: "Bengaluru", verificationStatus: "Unverified" },
  { name: "Patel Enterprises", city: "Ahmedabad", verificationStatus: "Unverified" },
  { name: "Deepak Joshi", city: "Pune", verificationStatus: "Verified" },
  { name: "Sunil Kapoor", city: "Delhi NCR", verificationStatus: "Verified" },
];

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

export const OWNERS = RAW_OWNERS.map((o, index) => {
  const id = `OWN-${2001 + index}`;
  const propertiesOwnedCount = 1 + pseudoRandom(index + 3, 6);
  const day = 1 + (index % 27);
  const month = 1 + (index % 12);
  const year = 2021 + (index % 5);

  return {
    id,
    name: o.name,
    phone: `+91 8${(600000000 + index * 811).toString().slice(0, 9)}`,
    email: `${o.name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
    propertiesOwnedCount,
    city: o.city,
    joinedDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    verificationStatus: o.verificationStatus,
  };
});

export function getOwnerById(id) {
  return OWNERS.find((o) => o.id === id);
}

export const OWNER_CITIES = [...new Set(OWNERS.map((o) => o.city))];
