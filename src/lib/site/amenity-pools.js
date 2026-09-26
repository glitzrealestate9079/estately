// Shared between the property detail page (which amenity to check "on"/"off"
// against p.amenities) and the post-property wizard's Amenities step (which
// checkboxes to offer) — residential reuses the admin's own AMENITIES list
// (src/lib/constants.js) so a wizard-entered amenity is always something
// admin's own property-edit form recognises too; plot/PG get their own
// smaller, type-appropriate pools, matching the original prototype's
// per-kind amenity lists.
import { AMENITIES } from "@/lib/constants";

export const AMENITY_POOLS = {
  pg: ["Wi-Fi", "Power Backup", "CCTV", "RO Water", "Security", "Laundry", "Parking"],
  plot: ["Boundary Wall", "Road Access", "Water Connection", "Electricity", "Security"],
  default: AMENITIES,
};

export const AMENITY_ICONS = {
  Parking: "bi-p-square",
  Lift: "bi-arrow-down-up",
  "Power Backup": "bi-lightning-charge",
  Security: "bi-shield-check",
  Gym: "bi-heart-pulse",
  "Swimming Pool": "bi-water",
  Garden: "bi-tree",
  "Club House": "bi-house-heart",
  CCTV: "bi-camera-video",
  "Children's Play Area": "bi-emoji-smile",
  "Rain Water Harvesting": "bi-cloud-rain",
  Intercom: "bi-telephone",
  "Wi-Fi": "bi-wifi",
  "RO Water": "bi-cup-straw",
  Laundry: "bi-basket",
  "Boundary Wall": "bi-bricks",
  "Road Access": "bi-signpost-2",
  "Water Connection": "bi-droplet",
  Electricity: "bi-lightning-charge",
};
