import * as yup from "yup";

const PHONE_REGEX = /^\+?[0-9\s-]{10,15}$/;

export const agentSchema = yup.object({
  name: yup.string().trim().required("Agent name is required").min(3, "Name should be at least 3 characters"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(PHONE_REGEX, "Please enter a valid phone number"),
  email: yup.string().trim().required("Email is required").email("Please enter a valid email address"),
  agency: yup.string().trim().required("Agency name is required"),
  licenseNumber: yup.string().trim().required("License number is required"),
  city: yup.string().required("Please select a city"),
  status: yup.string().required("Please select a status"),
});

export const AGENT_DEFAULT_VALUES = {
  name: "",
  phone: "",
  email: "",
  agency: "",
  licenseNumber: "",
  city: "",
  status: "Active",
};
