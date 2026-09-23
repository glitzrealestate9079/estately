import * as yup from "yup";

export const blogSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Blog title is required")
    .min(8, "Title should be at least 8 characters"),
  excerpt: yup
    .string()
    .trim()
    .required("Excerpt is required")
    .min(20, "Excerpt should be at least 20 characters"),
  coverImage: yup
    .string()
    .trim()
    .required("Cover image URL is required")
    .url("Please enter a valid image URL"),
  author: yup.string().trim().required("Author name is required"),
  status: yup.string().required("Please select a status"),
});

export const BLOG_DEFAULT_VALUES = {
  title: "",
  excerpt: "",
  coverImage: "",
  author: "",
  status: "Draft",
};
