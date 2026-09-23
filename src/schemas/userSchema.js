import * as yup from "yup";
import { USER_ROLES } from "@/lib/constants";

export const USER_STATUSES = ["Active", "Inactive"];

export const userSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Full name is required")
    .min(3, "Name should be at least 3 characters"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
  role: yup
    .string()
    .required("Please select a role")
    .oneOf(USER_ROLES, "Please select a valid role"),
  status: yup
    .string()
    .required("Please select a status")
    .oneOf(USER_STATUSES, "Please select a valid status"),
});

export const USER_DEFAULT_VALUES = {
  name: "",
  email: "",
  role: "",
  status: "Active",
};
