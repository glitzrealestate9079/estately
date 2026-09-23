import * as yup from "yup";

const PHONE_REGEX = /^\+?[0-9\s-]{10,15}$/;
const WEBSITE_REGEX = /^https?:\/\/.+\..+/;

export const developerSchema = yup.object({
  name: yup.string().trim().required("Developer name is required").min(3, "Name should be at least 3 characters"),
  email: yup.string().trim().required("Email is required").email("Please enter a valid email address"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(PHONE_REGEX, "Please enter a valid phone number"),
  website: yup
    .string()
    .trim()
    .required("Website is required")
    .matches(WEBSITE_REGEX, "Please enter a valid website URL (e.g. https://example.com)"),
  city: yup.string().required("Please select a city"),
  establishedYear: yup
    .number()
    .typeError("Established year must be a number")
    .required("Established year is required")
    .integer("Established year must be a whole number")
    .min(1800, "Please enter a valid year")
    .max(2026, "Established year cannot be in the future"),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(20, "Description should be at least 20 characters"),
});

export const DEVELOPER_DEFAULT_VALUES = {
  name: "",
  email: "",
  phone: "",
  website: "",
  city: "",
  establishedYear: "",
  description: "",
};
