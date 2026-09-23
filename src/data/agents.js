// Mock data for the Agents module. Deterministic (no Math.random/Date.now) so
// server and client render identically.

const RAW_AGENTS = [
  { name: "Kavita Singh", city: "Jaipur", agency: "Singh Realty Associates", status: "Active" },
  { name: "Rahul Sharma", city: "Gurugram", agency: "Horizon Realty Partners", status: "Active" },
  { name: "Arjun Nair", city: "Pune", agency: "Nair & Co. Properties", status: "Active" },
  { name: "Sneha Pillai", city: "Chennai", agency: "Coastal Realty Group", status: "Active" },
  { name: "Priya Malhotra", city: "Delhi NCR", agency: "Malhotra Estates", status: "Active" },
  { name: "Vikram Chauhan", city: "Mumbai", agency: "Skyline Realty Advisors", status: "Inactive" },
  { name: "Ananya Iyer", city: "Bengaluru", agency: "Iyer Home Solutions", status: "Active" },
  { name: "Rohit Bansal", city: "Noida", agency: "Bansal Property Hub", status: "Active" },
  { name: "Meera Krishnan", city: "Hyderabad", agency: "Krishnan Realty Works", status: "Inactive" },
  { name: "Aditya Kapoor", city: "Ahmedabad", agency: "Kapoor Land & Homes", status: "Active" },
  { name: "Divya Menon", city: "Chennai", agency: "Menon Property Consultants", status: "Active" },
  { name: "Karan Thakur", city: "Jaipur", agency: "Thakur Realty Ventures", status: "Active" },
];

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

export const AGENTS = RAW_AGENTS.map((a, index) => {
  const id = `AGT-${1001 + index}`;
  const propertiesCount = 4 + pseudoRandom(index + 1, 38);
  const leadsCount = 18 + pseudoRandom(index + 5, 140);
  const conversions = 3 + pseudoRandom(index + 9, Math.max(4, Math.round(leadsCount * 0.3)));
  const day = 1 + (index % 27);
  const month = 1 + (index % 12);
  const year = 2022 + (index % 4);

  return {
    id,
    name: a.name,
    avatar: `https://i.pravatar.cc/150?img=${((index * 7) % 70) + 1}`,
    phone: `+91 9${(700000000 + index * 913).toString().slice(0, 9)}`,
    email: `${a.name.toLowerCase().replace(/[^a-z]+/g, ".")}@${a.agency
      .toLowerCase()
      .split(" ")[0]
      .replace(/[^a-z]/g, "")}.com`,
    agency: a.agency,
    licenseNumber: `RERA-AG-${year}-${(2000 + index * 37).toString().padStart(4, "0")}`,
    city: a.city,
    propertiesCount,
    leadsCount,
    conversions,
    status: a.status,
    joinedDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
});

export function getAgentById(id) {
  return AGENTS.find((a) => a.id === id);
}

export const AGENT_CITIES = [...new Set(AGENTS.map((a) => a.city))];
