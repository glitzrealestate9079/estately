// Mock data for the Leads (CRM) module. Deterministic (no Math.random/Date.now
// at module scope) so server and client render identically.

import { AGENTS } from "@/data/agents";
import { LEAD_STATUSES } from "@/schemas/leadSchema";

// Reuse the same four agents (and their avatars) that already appear in the
// Agents module, so a lead's assigned agent matches that agent's profile
// everywhere in the admin.
const LEAD_AGENT_NAMES = ["Kavita Singh", "Rahul Sharma", "Arjun Nair", "Sneha Pillai"];
export const LEAD_AGENTS = LEAD_AGENT_NAMES.map((name) => AGENTS.find((a) => a.name === name)).filter(Boolean);

const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com"];

const RAW_LEADS = [
  { name: "Ananya Kapoor", propertyType: "Apartment", interestedProperty: "3 BHK Apartment in Malviya Nagar", location: "Malviya Nagar, Jaipur", budget: 12000000, source: "Website", assignedAgent: "Kavita Singh", status: "New", notes: "Filled the enquiry form on the website, awaiting first contact." },
  { name: "Rohan Mehta", propertyType: "Villa", interestedProperty: "4 BHK Villa with private pool, Golf Course Road", location: "Golf Course Road, Gurugram", budget: 45000000, source: "Referral", assignedAgent: "Rahul Sharma", status: "Contacted", notes: "Referred by an existing client. Called once, asked for a brochure." },
  { name: "Priya Nair", propertyType: "Apartment", interestedProperty: "2 BHK Apartment for rent near Whitefield", location: "Whitefield, Bengaluru", budget: 42000, source: "Walk-in", assignedAgent: "Arjun Nair", status: "Follow-up", notes: "Visited the office, shortlisting 3 properties. Follow-up call scheduled." },
  { name: "Suresh Iyer", propertyType: "Independent House", interestedProperty: "3 BHK Independent House in Baner", location: "Baner, Pune", budget: 18500000, source: "Portal", assignedAgent: "Sneha Pillai", status: "Interested", notes: "Liked the listing on the portal, requested a site visit." },
  { name: "Neha Kulkarni", propertyType: "Office Space", interestedProperty: "Grade-A office space in BKC", location: "Bandra Kurla Complex, Mumbai", budget: 350000, source: "Social Media", assignedAgent: "Kavita Singh", status: "Site Visit", notes: "Site visit scheduled for the BKC office space next week." },
  { name: "Vikram Desai", propertyType: "Villa", interestedProperty: "5 BHK Villa, Jubilee Hills", location: "Jubilee Hills, Hyderabad", budget: 68000000, source: "Campaign", assignedAgent: "Rahul Sharma", status: "Negotiation", notes: "Negotiating final price, expects to close within 2 weeks." },
  { name: "Anjali Bhatt", propertyType: "Apartment", interestedProperty: "1 BHK affordable apartment, Sector 62", location: "Sector 62, Noida", budget: 3800000, source: "Website", assignedAgent: "Arjun Nair", status: "Converted", notes: "Booking confirmed, token amount received." },
  { name: "Manoj Pillai", propertyType: "Plot", interestedProperty: "Residential plot near OMR", location: "OMR, Chennai", budget: 9500000, source: "Referral", assignedAgent: "Sneha Pillai", status: "Lost", notes: "Went with a competitor builder, marked as lost." },
  { name: "Kavya Reddy", propertyType: "PG / Co-living", interestedProperty: "Co-living PG in Koramangala", location: "Koramangala, Bengaluru", budget: 18500, source: "Walk-in", assignedAgent: "Kavita Singh", status: "New", notes: "Walked in asking about PG availability for working women." },
  { name: "Arvind Rao", propertyType: "Commercial", interestedProperty: "Retail showroom on SG Highway", location: "SG Highway, Ahmedabad", budget: 28000000, source: "Portal", assignedAgent: "Rahul Sharma", status: "Contacted", notes: "Called back after the portal enquiry, discussing showroom layout." },
  { name: "Divya Menon", propertyType: "Apartment", interestedProperty: "3 BHK apartment with garden view, Kharadi", location: "Kharadi, Pune", budget: 11200000, source: "Social Media", assignedAgent: "Arjun Nair", status: "Follow-up", notes: "Requested more photos, follow-up planned for the weekend." },
  { name: "Farhan Sheikh", propertyType: "Farmhouse", interestedProperty: "Farmhouse retreat with orchard, Chandwaji", location: "Chandwaji, Jaipur", budget: 21000000, source: "Campaign", assignedAgent: "Sneha Pillai", status: "Interested", notes: "Interested in a weekend farmhouse for family gatherings." },
  { name: "Meenal Joshi", propertyType: "Apartment", interestedProperty: "2 BHK apartment near metro, Dwarka", location: "Dwarka, Delhi NCR", budget: 24000, source: "Website", assignedAgent: "Kavita Singh", status: "Site Visit", notes: "Site visit done, liked the unit, awaiting a decision." },
  { name: "Ritesh Chawla", propertyType: "Independent House", interestedProperty: "3 BHK Independent House with terrace garden, Vaishali Nagar", location: "Vaishali Nagar, Jaipur", budget: 15800000, source: "Referral", assignedAgent: "Rahul Sharma", status: "Negotiation", notes: "Negotiating on maintenance and parking terms." },
  { name: "Sonal Trivedi", propertyType: "Apartment", interestedProperty: "4 BHK sea-facing apartment, Worli", location: "Worli, Mumbai", budget: 95000000, source: "Walk-in", assignedAgent: "Arjun Nair", status: "Converted", notes: "Deal closed, registration is in process." },
  { name: "Gaurav Malhotra", propertyType: "Apartment", interestedProperty: "Studio apartment, Indiranagar", location: "Indiranagar, Bengaluru", budget: 28000, source: "Portal", assignedAgent: "Sneha Pillai", status: "Lost", notes: "Budget mismatch, lead marked as lost." },
  { name: "Ishita Sharma", propertyType: "Villa", interestedProperty: "4 BHK villa in gated township, Hinjewadi", location: "Hinjewadi, Pune", budget: 32000000, source: "Social Media", assignedAgent: "Kavita Singh", status: "New", notes: "New enquiry via an Instagram ad, not yet contacted." },
  { name: "Devansh Oberoi", propertyType: "Office Space", interestedProperty: "Furnished office space, Cyber City", location: "Cyber City, Gurugram", budget: 480000, source: "Campaign", assignedAgent: "Rahul Sharma", status: "Contacted", notes: "First call done, sending floor plans." },
  { name: "Pooja Agarwal", propertyType: "Plot", interestedProperty: "Corner plot in developing sector, Sector 150", location: "Sector 150, Noida", budget: 14500000, source: "Website", assignedAgent: "Arjun Nair", status: "Follow-up", notes: "Requested legal documents, follow-up planned for next week." },
  { name: "Karthik Subramaniam", propertyType: "Apartment", interestedProperty: "2 BHK apartment, Gachibowli", location: "Gachibowli, Hyderabad", budget: 32000, source: "Referral", assignedAgent: "Sneha Pillai", status: "Interested", notes: "Shortlisted 2 units, planning a visit." },
  { name: "Ritu Bhandari", propertyType: "Villa", interestedProperty: "Boutique villa with home theatre, ECR", location: "ECR, Chennai", budget: 52000000, source: "Walk-in", assignedAgent: "Kavita Singh", status: "Site Visit", notes: "Site visit scheduled with family this weekend." },
  { name: "Sameer Khan", propertyType: "PG / Co-living", interestedProperty: "PG for women, Lajpat Nagar", location: "Lajpat Nagar, Delhi NCR", budget: 15000, source: "Portal", assignedAgent: "Rahul Sharma", status: "Negotiation", notes: "Negotiating on monthly rent and security deposit." },
  { name: "Tanvi Kulshreshtha", propertyType: "Apartment", interestedProperty: "4 BHK duplex penthouse, Lower Parel", location: "Lower Parel, Mumbai", budget: 78000000, source: "Social Media", assignedAgent: "Arjun Nair", status: "Converted", notes: "Booking finalized, agreement signed." },
  { name: "Aakash Verma", propertyType: "Plot", interestedProperty: "Commercial land near expressway, Chakan", location: "Chakan, Pune", budget: 36000000, source: "Campaign", assignedAgent: "Sneha Pillai", status: "Lost", notes: "Investor backed out due to a funding issue." },
  { name: "Nisha Kaur", propertyType: "Apartment", interestedProperty: "3 BHK apartment with clubhouse access, Sarjapur Road", location: "Sarjapur Road, Bengaluru", budget: 14800000, source: "Website", assignedAgent: "Kavita Singh", status: "New", notes: "Filled the enquiry form, needs a callback." },
  { name: "Yash Thakkar", propertyType: "Independent House", interestedProperty: "Heritage bungalow, Civil Lines", location: "Civil Lines, Jaipur", budget: 42000000, source: "Referral", assignedAgent: "Rahul Sharma", status: "Contacted", notes: "Called once, interested in heritage properties." },
  { name: "Ritika Chandra", propertyType: "Apartment", interestedProperty: "3 BHK apartment, Malviya Nagar", location: "Malviya Nagar, Jaipur", budget: 12800000, source: "Walk-in", assignedAgent: "Arjun Nair", status: "Follow-up", notes: "Visited the office again, comparing two projects." },
  { name: "Deepak Nambiar", propertyType: "Commercial", interestedProperty: "Retail space, Koramangala", location: "Koramangala, Bengaluru", budget: 32000000, source: "Portal", assignedAgent: "Sneha Pillai", status: "Interested", notes: "Enquired about lease vs buy options." },
  { name: "Alisha Fernandes", propertyType: "Farmhouse", interestedProperty: "Weekend farmhouse near Lonavala", location: "Lonavala, Pune", budget: 26000000, source: "Social Media", assignedAgent: "Kavita Singh", status: "Site Visit", notes: "Site visit done, evaluating with family." },
  { name: "Rajeev Menon", propertyType: "Villa", interestedProperty: "Premium villa, Jubilee Hills", location: "Jubilee Hills, Hyderabad", budget: 71000000, source: "Campaign", assignedAgent: "Rahul Sharma", status: "Negotiation", notes: "Final negotiation on the payment schedule." },
];

const STAGE_ACTIONS = {
  New: "Lead captured",
  Contacted: "Agent made first contact",
  "Follow-up": "Follow-up call scheduled",
  Interested: "Shared shortlisted properties",
  "Site Visit": "Site visit conducted",
  Negotiation: "Price negotiation in progress",
  Converted: "Deal closed — lead converted",
  Lost: "Lead marked as lost",
};

function buildTimeline(leadId, status) {
  const statusIndex = LEAD_STATUSES.indexOf(status);
  const steps = LEAD_STATUSES.slice(0, statusIndex + 1);
  return steps.map((stepStatus, i) => {
    const daysAgo = (steps.length - 1 - i) * 4;
    return {
      id: `${leadId}-t${i}`,
      status: stepStatus,
      label: STAGE_ACTIONS[stepStatus],
      time: daysAgo === 0 ? "Today" : `${daysAgo} days ago`,
    };
  });
}

export const LEADS = RAW_LEADS.map((l, index) => {
  const id = `LD-${2001 + index}`;
  const month = 1 + (index % 9);
  const day = 1 + ((index * 5) % 27);
  const emailHandle = l.name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "");

  return {
    id,
    name: l.name,
    phone: `+91 9${(800000000 + index * 137).toString().slice(0, 9)}`,
    email: `${emailHandle}@${EMAIL_DOMAINS[index % EMAIL_DOMAINS.length]}`,
    interestedProperty: l.interestedProperty,
    propertyType: l.propertyType,
    location: l.location,
    budget: l.budget,
    source: l.source,
    assignedAgent: l.assignedAgent,
    status: l.status,
    notes: l.notes,
    createdDate: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    timeline: buildTimeline(id, l.status),
  };
});

export function getAgentByName(name) {
  return LEAD_AGENTS.find((a) => a.name === name);
}
