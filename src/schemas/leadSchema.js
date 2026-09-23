import * as yup from "yup";

const PHONE_REGEX = /^\+?[0-9\s-]{10,15}$/;

// Canonical pipeline order used across the Leads module (table, kanban, drawer).
export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Follow-up",
  "Interested",
  "Site Visit",
  "Negotiation",
  "Converted",
  "Lost",
];

export const leadSchema = yup.object({
  name: yup.string().trim().required("Lead name is required").min(3, "Name should be at least 3 characters"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(PHONE_REGEX, "Please enter a valid phone number"),
  email: yup.string().trim().required("Email is required").email("Please enter a valid email address"),
  interestedProperty: yup
    .string()
    .trim()
    .required("Please describe the property this lead is interested in")
    .min(5, "Please add a little more detail"),
  budget: yup
    .number()
    .typeError("Budget is required")
    .required("Budget is required")
    .moreThan(0, "Budget must be greater than 0"),
  location: yup.string().trim().required("Preferred location is required"),
  propertyType: yup.string().required("Please select a property type"),
  source: yup.string().required("Please select a lead source"),
  assignedAgent: yup.string().required("Please assign an agent"),
  status: yup.string().required("Please select a status"),
  notes: yup.string().trim().nullable(),
});

export const LEAD_DEFAULT_VALUES = {
  name: "",
  phone: "",
  email: "",
  interestedProperty: "",
  budget: "",
  location: "",
  propertyType: "",
  source: "",
  assignedAgent: "",
  status: "New",
  notes: "",
};
