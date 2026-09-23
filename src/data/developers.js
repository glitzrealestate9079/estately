// Mock developer directory for the Developers module (Property Management > Developers).
// Names/cities are loosely cross-referenced with the flagship listings in src/data/projects.js
// (when present) for cross-module consistency, but this file has no import dependency on it.

const RAW_DEVELOPERS = [
  {
    name: "Horizon Developers",
    city: "Gurugram",
    establishedYear: 2001,
    description:
      "A diversified residential and commercial developer known for large gated townships and Grade-A office parks across the Delhi NCR belt.",
    projectsCount: 9,
    totalUnits: 3400,
    leadsCount: 210,
    status: "Active",
    projects: [
      { name: "Horizon Skyline Residences", type: "Residential", units: 420, status: "New Launch" },
      { name: "Horizon Business Park", type: "Commercial", units: 180, status: "Ready to Move" },
      { name: "Horizon Greens Villas", type: "Villa Township", units: 96, status: "Under Construction" },
    ],
  },
  {
    name: "Amrapali Estates",
    city: "Noida",
    establishedYear: 2005,
    description:
      "Mid-sized residential specialist focused on mid-income apartment communities with strong possession track record across Noida and Gurugram.",
    projectsCount: 6,
    totalUnits: 2600,
    leadsCount: 150,
    status: "Active",
    projects: [
      { name: "Amrapali Emerald Greens", type: "Residential", units: 560, status: "Under Construction" },
      { name: "Amrapali Sunview Apartments", type: "Residential", units: 240, status: "Ready to Move" },
    ],
  },
  {
    name: "Prestige Homes Pvt Ltd",
    city: "Bengaluru",
    establishedYear: 1994,
    description:
      "Premium residential and lakeview township developer with a strong presence across Bengaluru's IT corridor, recognised for on-time delivery.",
    projectsCount: 18,
    totalUnits: 6200,
    leadsCount: 380,
    status: "Active",
    projects: [
      { name: "Prestige Lakeview Towers", type: "Residential", units: 300, status: "Ready to Move" },
      { name: "Prestige Tech Quadrant", type: "Commercial", units: 140, status: "Under Construction" },
      { name: "Prestige Orchid Meadows", type: "Residential", units: 260, status: "New Launch" },
    ],
  },
  {
    name: "Skyline Towers Pvt Ltd",
    city: "Mumbai",
    establishedYear: 2010,
    description:
      "Boutique high-rise developer building premium and commercial towers in Mumbai's business districts; currently scaling back new launches.",
    projectsCount: 5,
    totalUnits: 1400,
    leadsCount: 60,
    status: "Inactive",
    projects: [
      { name: "Skyline Business Bay", type: "Commercial", units: 180, status: "Under Construction" },
      { name: "Skyline Penthouse Residences", type: "Residential", units: 64, status: "New Launch" },
    ],
  },
  {
    name: "Godrej Properties",
    city: "Pune",
    establishedYear: 1990,
    description:
      "National-scale developer with a diversified portfolio spanning residential townships, commercial parks and plotted developments across India.",
    projectsCount: 22,
    totalUnits: 8400,
    leadsCount: 460,
    status: "Active",
    projects: [
      { name: "Godrej Woodscape", type: "Residential", units: 480, status: "New Launch" },
      { name: "Godrej Eden Business Hub", type: "Commercial", units: 210, status: "Under Construction" },
      { name: "Godrej Riverside Residences", type: "Residential", units: 340, status: "Upcoming" },
    ],
  },
  {
    name: "Lodha Group",
    city: "Pune",
    establishedYear: 1980,
    description:
      "One of the country's largest real estate developers, delivering luxury towers, villa townships and integrated mixed-use developments.",
    projectsCount: 24,
    totalUnits: 9600,
    leadsCount: 520,
    status: "Active",
    projects: [
      { name: "Lodha Elite Meadows", type: "Villa Township", units: 150, status: "Upcoming" },
      { name: "Lodha Skyline Residences", type: "Residential", units: 520, status: "Under Construction" },
      { name: "Lodha Signature Towers", type: "Residential", units: 380, status: "New Launch" },
    ],
  },
  {
    name: "Sobha Developers",
    city: "Bengaluru",
    establishedYear: 1995,
    description:
      "Engineering-led residential developer known for in-house construction quality control and premium apartment communities in South India.",
    projectsCount: 16,
    totalUnits: 5200,
    leadsCount: 310,
    status: "Active",
    projects: [
      { name: "Sobha Palm Residency", type: "Residential", units: 260, status: "Ready to Move" },
      { name: "Sobha Forest View", type: "Residential", units: 310, status: "Under Construction" },
    ],
  },
  {
    name: "Brigade Group",
    city: "Bengaluru",
    establishedYear: 1986,
    description:
      "Mixed-use development powerhouse spanning residential, commercial, hospitality and retail projects across South India's major metros.",
    projectsCount: 20,
    totalUnits: 7100,
    leadsCount: 400,
    status: "Active",
    projects: [
      { name: "Brigade Metropolis", type: "Mixed-Use", units: 620, status: "Under Construction" },
      { name: "Brigade Tech Gardens Annex", type: "Commercial", units: 190, status: "Ready to Move" },
      { name: "Brigade Lakefront Residences", type: "Residential", units: 280, status: "New Launch" },
    ],
  },
  {
    name: "DLF Limited",
    city: "Gurugram",
    establishedYear: 1946,
    description:
      "India's largest publicly listed real estate developer, with an iconic portfolio of commercial cyber parks and premium residential enclaves.",
    projectsCount: 15,
    totalUnits: 4800,
    leadsCount: 340,
    status: "Active",
    projects: [
      { name: "DLF Cyber Heights", type: "Commercial", units: 90, status: "Ready to Move" },
      { name: "DLF Camellia Residences", type: "Residential", units: 220, status: "Completed" },
    ],
  },
  {
    name: "Puravankara",
    city: "Chennai",
    establishedYear: 1975,
    description:
      "Long-established developer of plotted developments and mid-to-premium residential communities across South India's growth corridors.",
    projectsCount: 12,
    totalUnits: 3900,
    leadsCount: 240,
    status: "Active",
    projects: [
      { name: "Puravankara Sunflower County", type: "Plotted Development", units: 220, status: "Upcoming" },
      { name: "Purva Riverside Meadows", type: "Residential", units: 280, status: "Under Construction" },
    ],
  },
  {
    name: "Shapoorji Pallonji",
    city: "Mumbai",
    establishedYear: 1865,
    description:
      "Legacy conglomerate real estate arm delivering landmark luxury residential towers and large-format infrastructure-led developments.",
    projectsCount: 10,
    totalUnits: 3300,
    leadsCount: 220,
    status: "Active",
    projects: [
      { name: "Shapoorji Parkwest Residences", type: "Residential", units: 340, status: "New Launch" },
      { name: "SP Imperial Court", type: "Residential", units: 180, status: "Ready to Move" },
    ],
  },
  {
    name: "Mahindra Lifespaces",
    city: "Ahmedabad",
    establishedYear: 1994,
    description:
      "Sustainability-focused developer building integrated cities and affordable-to-mid housing developments across Western India.",
    projectsCount: 8,
    totalUnits: 2900,
    leadsCount: 180,
    status: "Active",
    projects: [
      { name: "Mahindra Happinest Homes", type: "Residential", units: 500, status: "Under Construction" },
      { name: "Mahindra Eco World Residences", type: "Residential", units: 260, status: "Completed" },
    ],
  },
  {
    name: "Rajasthan Farms LLP",
    city: "Jaipur",
    establishedYear: 2012,
    description:
      "Small regional partnership developing farmhouse retreats and villa townships around Jaipur's outer growth belt.",
    projectsCount: 3,
    totalUnits: 480,
    leadsCount: 22,
    status: "Inactive",
    projects: [
      { name: "Rajasthan Heritage Villas", type: "Villa Township", units: 80, status: "Completed" },
      { name: "Rajasthan Orchard Farms", type: "Farmhouse", units: 42, status: "Ready to Move" },
    ],
  },
  {
    name: "Casagrand Builders",
    city: "Chennai",
    establishedYear: 1999,
    description:
      "Fast-growing Chennai-headquartered developer specialising in plotted developments and affordable gated residential communities.",
    projectsCount: 11,
    totalUnits: 3600,
    leadsCount: 260,
    status: "Active",
    projects: [
      { name: "Casagrand Elite Greens", type: "Plotted Development", units: 300, status: "New Launch" },
      { name: "Casagrand Athens Villas", type: "Villa Township", units: 120, status: "Under Construction" },
    ],
  },
];

export const DEVELOPERS = RAW_DEVELOPERS.map((d, index) => {
  const id = `DEV-${1000 + index}`;
  const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const day = 3 + (index % 25);
  const month = 1 + (index % 8);

  return {
    id,
    ...d,
    email: `contact@${slug}.com`,
    phone: `+91 9${(700000000 + index * 913).toString().slice(0, 9)}`,
    website: `https://www.${slug}.com`,
    createdDate: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
});

export function getDeveloperById(id) {
  return DEVELOPERS.find((d) => d.id === id);
}
