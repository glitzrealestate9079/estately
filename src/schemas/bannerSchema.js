import * as yup from "yup";

export const bannerSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Banner title is required")
    .min(5, "Title should be at least 5 characters"),
  subtitle: yup
    .string()
    .trim()
    .required("Subtitle is required")
    .min(10, "Subtitle should be at least 10 characters"),
  image: yup
    .string()
    .trim()
    .required("Image URL is required")
    .url("Please enter a valid image URL"),
  ctaLabel: yup.string().trim().required("CTA label is required"),
  ctaUrl: yup.string().trim().required("CTA URL is required"),
  status: yup.string().required("Please select a status"),
  sortOrder: yup
    .number()
    .typeError("Sort order must be a number")
    .required("Sort order is required")
    .min(1, "Sort order must be at least 1"),
});

export const BANNER_DEFAULT_VALUES = {
  title: "",
  subtitle: "",
  image: "",
  ctaLabel: "",
  ctaUrl: "",
  status: "Active",
  sortOrder: 1,
};
