import {
  daysAgo,
  deriveProjectBhk,
  deriveProjectTowers,
  deriveProjectAcres,
  deriveProjectSizes,
  deriveProjectUnits,
  deriveProjectTowerNames,
} from "@/lib/site/derived";

const PTYPE_MAP = { Residential: "Apartment", "Villa Township": "Villa" };

// Reshapes a real PROJECTS row (src/data/projects.js) into the field
// vocabulary the ported HomePlace template's project card/detail expect.
export function toTemplateProject(project) {
  const bhk = deriveProjectBhk(project);
  const sizes = deriveProjectSizes(project);
  const towerCount = deriveProjectTowers(project);
  return {
    id: project.id,
    slug: project.slug,
    cat: "project",
    name: project.projectName,
    developer: project.developer,
    ptype: PTYPE_MAP[project.projectType] ?? project.projectType,
    status: project.status,
    loc: project.locality,
    sub: project.locality,
    city: project.city,
    images: project.images,
    rera: project.reraNumber,
    minPrice: project.startingPrice,
    maxPrice: project.priceRangeMax,
    units: project.totalUnits,
    availableUnits: project.availableUnits,
    bhk,
    towers: towerCount,
    towerNames: deriveProjectTowerNames(towerCount),
    acres: deriveProjectAcres(project),
    sizes,
    unitTypes: deriveProjectUnits(project, bhk, sizes, project.startingPrice, project.priceRangeMax, project.availableUnits),
    possession: project.status === "Ready to Move" ? "Ready to move" : formatPossessionDate(project.possessionDate),
    amenities: project.amenities,
    description: project.description,
    updated: daysAgo(project.createdAt),
    // Admin's schema has no distinct "launch date" field — createdAt is the
    // closest real field to stand in for when the project was announced.
    launched: formatPossessionDate(project.createdAt),
    _project: project,
  };
}

function formatPossessionDate(dateStr) {
  if (!dateStr) return "TBA";
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(new Date(dateStr));
}
