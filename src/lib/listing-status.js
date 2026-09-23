// Drives the "Listing Status" panel on the property detail page: the friendly
// label/description shown for each lifecycle status, and the transition
// actions available from that status. Keys are lowercase to match the
// lowercase status strings used across src/data/properties.js lookups.
export const LISTING_STATUS_META = {
  active: {
    label: "Published",
    description: "This listing is live and visible in search results.",
    actions: [
      { label: "Pause Listing", target: "paused", variant: "outline" },
      { label: "Mark as Sold", target: "sold", variant: "default" },
      { label: "Mark as Rented", target: "rented", variant: "default" },
      { label: "Archive", target: "archived", variant: "outline" },
    ],
  },
  pending: {
    label: "Under Review",
    description: "Awaiting admin approval before it goes live.",
    actions: [
      { label: "Approve", target: "active", variant: "default" },
      { label: "Reject", target: "rejected", variant: "destructive" },
    ],
  },
  draft: {
    label: "Draft",
    description: "Not yet submitted for review.",
    actions: [{ label: "Submit for Review", target: "pending", variant: "default" }],
  },
  paused: {
    label: "Paused",
    description: "Temporarily hidden from search and listings.",
    actions: [{ label: "Resume Listing", target: "active", variant: "default" }],
  },
  rejected: {
    label: "Rejected",
    description: "This listing was rejected. The reason is shown to the owner.",
    actions: [{ label: "Move back to Draft", target: "draft", variant: "outline" }],
  },
  expired: {
    label: "Expired",
    description: "This listing's validity has ended.",
    actions: [{ label: "Renew Listing", target: "active", variant: "default" }],
  },
  sold: {
    label: "Sold",
    description: "This property has been marked sold.",
    actions: [{ label: "Archive", target: "archived", variant: "outline" }],
  },
  rented: {
    label: "Rented",
    description: "This property has been marked rented.",
    actions: [{ label: "Archive", target: "archived", variant: "outline" }],
  },
  archived: {
    label: "Archived",
    description: "Hidden from listings but retained for records.",
    actions: [{ label: "Restore to Draft", target: "draft", variant: "outline" }],
  },
};
