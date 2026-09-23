// Mock data for the Saved Searches module. Deterministic (no Math.random/Date.now).

const RAW_SEARCHES = [
  { buyerName: "Aditya Malhotra", criteriaSummary: "3 BHK Apartments in Jaipur under ₹1.5 Cr", alertsEnabled: true },
  { buyerName: "Priya Chatterjee", criteriaSummary: "2 BHK Apartments for rent in Whitefield, Bengaluru", alertsEnabled: true },
  { buyerName: "Rohit Saxena", criteriaSummary: "4 BHK Villas with pool in Golf Course Road, Gurugram", alertsEnabled: false },
  { buyerName: "Kavya Nair", criteriaSummary: "PG / Co-living options near Koramangala, Bengaluru under ₹20K", alertsEnabled: true },
  { buyerName: "Manish Agrawal", criteriaSummary: "3 BHK Independent Houses in Baner, Pune", alertsEnabled: true },
  { buyerName: "Sneha Kulkarni", criteriaSummary: "Residential plots above 2000 sqft in Nashik", alertsEnabled: false },
  { buyerName: "Arvind Menon", criteriaSummary: "Furnished office space for lease in OMR, Chennai", alertsEnabled: true },
  { buyerName: "Divya Iyer", criteriaSummary: "2 BHK Apartments in Gachibowli, Hyderabad under ₹80L", alertsEnabled: true },
  { buyerName: "Karan Thakur", criteriaSummary: "1 BHK Apartments for rent near Sector 62, Noida", alertsEnabled: false },
  { buyerName: "Ritu Bhatia", criteriaSummary: "Sea-facing 4 BHK Apartments in Worli, Mumbai above ₹8 Cr", alertsEnabled: true },
  { buyerName: "Farhan Sheikh", criteriaSummary: "Retail showrooms on SG Highway, Ahmedabad", alertsEnabled: true },
  { buyerName: "Nandini Rao", criteriaSummary: "Co-living PGs for women in Kharadi, Pune", alertsEnabled: false },
];

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

export const SAVED_SEARCHES = RAW_SEARCHES.map((s, index) => {
  const id = `SSR-${5000 + index}`;
  const matchCount = 2 + pseudoRandom(index + 9, 48);
  const day = 1 + (index % 27);
  const month = 1 + (index % 12);
  const year = 2024 + (index % 2);

  return {
    id,
    buyerName: s.buyerName,
    criteriaSummary: s.criteriaSummary,
    alertsEnabled: s.alertsEnabled,
    matchCount,
    createdDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
});

export function getSavedSearchById(id) {
  return SAVED_SEARCHES.find((s) => s.id === id);
}
