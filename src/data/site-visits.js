// Mock data for the Site Visits module. Dates are fixed ISO strings (no Date.now()/Math.random())
// so server and client renders always agree.

export const SITE_VISIT_AGENTS = ["Kavita Singh", "Rahul Sharma", "Arjun Nair", "Sneha Pillai"];

const AGENT_AVATARS = {
  "Kavita Singh": "https://i.pravatar.cc/80?img=5",
  "Rahul Sharma": "https://i.pravatar.cc/80?img=12",
  "Arjun Nair": "https://i.pravatar.cc/80?img=33",
  "Sneha Pillai": "https://i.pravatar.cc/80?img=47",
};

export const SITE_VISIT_CITIES = [
  "Jaipur",
  "Gurugram",
  "Bengaluru",
  "Pune",
  "Mumbai",
  "Hyderabad",
  "Noida",
  "Chennai",
  "Ahmedabad",
  "Delhi NCR",
];

const RAW_VISITS = [
  { buyer: "Aditya Sharma", property: "3 BHK Apartment, Malviya Nagar", city: "Jaipur", agent: "Kavita Singh", date: "2026-09-15", time: "11:00 AM", status: "Completed", notes: "Buyer liked the balcony view, requested a follow-up quote." },
  { buyer: "Neha Kapoor", property: "Luxury Villa with Private Pool", city: "Gurugram", agent: "Rahul Sharma", date: "2026-09-16", time: "3:30 PM", status: "Cancelled", notes: "Buyer travelling, will reschedule next month." },
  { buyer: "Rohit Malhotra", property: "2 BHK Apartment near Metro", city: "Bengaluru", agent: "Arjun Nair", date: "2026-09-18", time: "10:00 AM", status: "Completed", notes: "" },
  { buyer: "Priya Nair", property: "Independent House with Terrace Garden", city: "Pune", agent: "Sneha Pillai", date: "2026-09-18", time: "2:00 PM", status: "Completed", notes: "Very interested, discussing price negotiation." },
  { buyer: "Sanjay Mehta", property: "Grade-A Office Space, Cyber City", city: "Gurugram", agent: "Kavita Singh", date: "2026-09-19", time: "12:30 PM", status: "Completed", notes: "" },
  { buyer: "Kavya Reddy", property: "5 BHK Villa, Gated Community", city: "Hyderabad", agent: "Rahul Sharma", date: "2026-09-20", time: "4:00 PM", status: "Cancelled", notes: "Buyer found another property." },
  { buyer: "Arjun Bhatt", property: "1 BHK Apartment, Sector 62", city: "Noida", agent: "Arjun Nair", date: "2026-09-22", time: "9:30 AM", status: "Completed", notes: "" },
  { buyer: "Divya Iyer", property: "Residential Plot near IT Corridor", city: "Chennai", agent: "Sneha Pillai", date: "2026-09-22", time: "1:15 PM", status: "Completed", notes: "Requested soil test report." },
  { buyer: "Manish Gupta", property: "Co-living PG, Koramangala", city: "Bengaluru", agent: "Kavita Singh", date: "2026-09-24", time: "10:30 AM", status: "Confirmed", notes: "" },
  { buyer: "Pooja Choudhary", property: "Retail Showroom on Main Highway", city: "Ahmedabad", agent: "Rahul Sharma", date: "2026-09-24", time: "1:00 PM", status: "Confirmed", notes: "Bringing business partner along." },
  { buyer: "Rahul Verma", property: "3 BHK Apartment with Garden View", city: "Pune", agent: "Arjun Nair", date: "2026-09-24", time: "5:00 PM", status: "Requested", notes: "" },
  { buyer: "Sneha Joshi", property: "Farmhouse Retreat with Orchard", city: "Jaipur", agent: "Sneha Pillai", date: "2026-09-25", time: "11:30 AM", status: "Confirmed", notes: "" },
  { buyer: "Vikram Chauhan", property: "2 BHK Apartment near Metro, Dwarka", city: "Delhi NCR", agent: "Kavita Singh", date: "2026-09-25", time: "3:45 PM", status: "Rescheduled", notes: "Moved from an earlier slot at buyer's request." },
  { buyer: "Anjali Menon", property: "Independent House, Vaishali Nagar", city: "Jaipur", agent: "Rahul Sharma", date: "2026-09-26", time: "9:00 AM", status: "Requested", notes: "" },
  { buyer: "Karan Thakur", property: "Sea-facing 4 BHK Apartment, Worli", city: "Mumbai", agent: "Arjun Nair", date: "2026-09-26", time: "2:30 PM", status: "Confirmed", notes: "VIP buyer, prepare welcome kit." },
  { buyer: "Ritu Agarwal", property: "Compact Studio Apartment, Indiranagar", city: "Bengaluru", agent: "Sneha Pillai", date: "2026-09-28", time: "12:00 PM", status: "Rescheduled", notes: "" },
  { buyer: "Suresh Pillai", property: "Premium Villa in Gated Township", city: "Pune", agent: "Kavita Singh", date: "2026-09-30", time: "10:15 AM", status: "Requested", notes: "" },
  { buyer: "Meera Krishnan", property: "Grade-A Office Space, Furnished", city: "Gurugram", agent: "Rahul Sharma", date: "2026-10-02", time: "4:30 PM", status: "Confirmed", notes: "" },
  { buyer: "Aman Khanna", property: "Corner Plot in Developing Sector", city: "Noida", agent: "Arjun Nair", date: "2026-10-05", time: "11:00 AM", status: "Requested", notes: "" },
  { buyer: "Shreya Desai", property: "Boutique Villa with Home Theatre", city: "Chennai", agent: "Sneha Pillai", date: "2026-10-08", time: "3:00 PM", status: "Confirmed", notes: "Second visit, ready to make an offer." },
];

export const SITE_VISITS = RAW_VISITS.map((v, index) => ({
  id: `SV-${2001 + index}`,
  buyerName: v.buyer,
  buyerPhone: `+91 9${(700000000 + index * 173).toString().slice(0, 9)}`,
  propertyTitle: v.property,
  city: v.city,
  agentName: v.agent,
  agentAvatar: AGENT_AVATARS[v.agent],
  date: v.date,
  time: v.time,
  status: v.status,
  notes: v.notes || "",
  createdAt: v.date,
}));
