import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  remember: yup.boolean().default(false),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Include at least one uppercase letter")
    .matches(/[0-9]/, "Include at least one number"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export const otpSchema = yup.object({
  otp: yup
    .string()
    .required("Enter the 6-digit code")
    .matches(/^\d{6}$/, "Enter a valid 6-digit code"),
});
