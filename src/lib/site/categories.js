import { Building2, Home, Users, Briefcase, Trees, FolderKanban } from "lucide-react";

// Every consumer-facing discovery surface (header tabs, homepage hero, mobile
// bottom nav, search results) is driven from this single config so the
// transaction → filter-vocabulary mapping from the product spec stays in one
// place instead of being re-decided per page.
export const CATEGORIES = {
  buy: {
    key: "buy",
    label: "Buy",
    hero: "Buy",
    href: "/buy",
    icon: Home,
    matches: (p) => p.listingType === "Sale" && p.type !== "Plot",
    propertyTypes: ["Apartment", "Villa", "Independent House", "Farmhouse"],
  },
  rent: {
    key: "rent",
    label: "Rent",
    hero: "Rent",
    href: "/rent",
    icon: Building2,
    matches: (p) => p.listingType === "Rent" && p.type !== "Office Space" && p.type !== "Commercial",
    propertyTypes: ["Apartment", "Villa", "Independent House"],
  },
  pg: {
    key: "pg",
    label: "PG / Co-living",
    hero: "PG",
    href: "/pg",
    icon: Users,
    matches: (p) => p.listingType === "PG",
    propertyTypes: ["PG / Co-living"],
  },
  commercial: {
    key: "commercial",
    label: "Commercial",
    hero: "Commercial",
    href: "/commercial",
    icon: Briefcase,
    matches: (p) => p.type === "Commercial" || p.type === "Office Space",
    propertyTypes: ["Commercial", "Office Space"],
  },
  plots: {
    key: "plots",
    label: "Plots / Land",
    hero: "Plots",
    href: "/plots",
    icon: Trees,
    matches: (p) => p.type === "Plot",
    propertyTypes: ["Plot"],
  },
  projects: {
    key: "projects",
    label: "New Projects",
    hero: "Projects",
    href: "/projects",
    icon: FolderKanban,
    matches: () => false,
    propertyTypes: [],
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
export const SEARCH_CATEGORY_LIST = CATEGORY_LIST.filter((c) => c.key !== "projects");

export function getCategory(key) {
  return CATEGORIES[key] ?? CATEGORIES.buy;
}

// Plots use the singular template-mapper key ("plot") the ported HomePlace
// card components expect, even though the route/category key is "plots".
export function getCategoryKeyForProperty(property) {
  const match = SEARCH_CATEGORY_LIST.find((c) => c.matches(property));
  const key = match?.key ?? "buy";
  return key === "plots" ? "plot" : key;
}
