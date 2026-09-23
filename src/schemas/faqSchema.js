import * as yup from "yup";

export const FAQ_CATEGORIES = ["General", "Listings", "Verification", "Payments"];

export const faqSchema = yup.object({
  question: yup
    .string()
    .trim()
    .required("Question is required")
    .min(10, "Question should be at least 10 characters"),
  answer: yup
    .string()
    .trim()
    .required("Answer is required")
    .min(20, "Answer should be at least 20 characters"),
  category: yup.string().required("Please select a category"),
});

export const FAQ_DEFAULT_VALUES = {
  question: "",
  answer: "",
  category: "General",
};
