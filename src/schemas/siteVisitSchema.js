import * as yup from "yup";

const TIME_REGEX = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

export const SITE_VISIT_STATUSES = ["Requested", "Confirmed", "Rescheduled", "Completed", "Cancelled"];

export const siteVisitSchema = yup.object({
  buyerName: yup.string().trim().required("Buyer name is required").min(3, "Enter a valid name"),
  buyerPhone: yup
    .string()
    .trim()
    .nullable()
    .transform((v) => (v ? v : null)),
  propertyTitle: yup
    .string()
    .trim()
    .required("Property title is required")
    .min(5, "Enter a valid property title"),
  agentName: yup.string().required("Please assign an agent"),
  date: yup.string().required("Visit date is required"),
  time: yup
    .string()
    .required("Visit time is required")
    .matches(TIME_REGEX, "Use a format like 11:30 AM"),
  city: yup.string().required("Please select a city"),
  status: yup.string().required("Please select a status"),
  notes: yup
    .string()
    .trim()
    .nullable()
    .transform((v) => (v ? v : null)),
});

export const SITE_VISIT_DEFAULT_VALUES = {
  buyerName: "",
  buyerPhone: "",
  propertyTitle: "",
  agentName: "",
  date: "",
  time: "",
  city: "",
  status: "Requested",
  notes: "",
};

// Small standalone schema for the "Reschedule" quick-action modal.
export const rescheduleSchema = yup.object({
  date: yup.string().required("New date is required"),
  time: yup
    .string()
    .required("New time is required")
    .matches(TIME_REGEX, "Use a format like 11:30 AM"),
});
