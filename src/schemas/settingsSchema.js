import * as yup from "yup";

const URL_MESSAGE = "Please enter a valid URL";

// ---- General ----
export const generalSettingsSchema = yup.object({
  platformName: yup.string().trim().required("Platform name is required").min(2, "Too short"),
  supportEmail: yup.string().trim().required("Support email is required").email("Please enter a valid email address"),
  timezone: yup.string().required("Please select a timezone"),
});

export const GENERAL_SETTINGS_DEFAULTS = {
  platformName: "Estately",
  supportEmail: "support@estately.example",
  timezone: "Asia/Kolkata",
};

// ---- Platform ----
export const platformSettingsSchema = yup.object({
  siteUrl: yup.string().trim().required("Site URL is required").url(URL_MESSAGE),
  defaultCurrency: yup.string().required("Please select a currency"),
  defaultLanguage: yup.string().required("Please select a language"),
  maintenanceMode: yup.boolean().default(false),
});

export const PLATFORM_SETTINGS_DEFAULTS = {
  siteUrl: "https://www.estately.example",
  defaultCurrency: "INR",
  defaultLanguage: "English",
  maintenanceMode: false,
};

// ---- Property ----
export const propertySettingsSchema = yup.object({
  maxImagesPerListing: yup
    .number()
    .typeError("Enter a number")
    .required("Required")
    .min(1, "Must be at least 1")
    .max(50, "Must be 50 or fewer"),
  listingExpiryDays: yup.number().typeError("Enter a number").required("Required").min(1, "Must be at least 1"),
  featuredListingPrice: yup.number().typeError("Enter a number").required("Required").min(0, "Cannot be negative"),
  autoApproveListings: yup.boolean().default(false),
});

export const PROPERTY_SETTINGS_DEFAULTS = {
  maxImagesPerListing: 20,
  listingExpiryDays: 90,
  featuredListingPrice: 2999,
  autoApproveListings: false,
};

// ---- Notifications ----
export const notificationSettingsSchema = yup.object({
  emailAlerts: yup.boolean().default(true),
  smsAlerts: yup.boolean().default(false),
  pushAlerts: yup.boolean().default(true),
  weeklyDigest: yup.boolean().default(true),
});

export const NOTIFICATION_SETTINGS_DEFAULTS = {
  emailAlerts: true,
  smsAlerts: false,
  pushAlerts: true,
  weeklyDigest: true,
};

// ---- Email ----
export const emailSettingsSchema = yup.object({
  smtpHost: yup.string().trim().required("SMTP host is required"),
  smtpPort: yup.number().typeError("Enter a number").required("Required").min(1, "Invalid port"),
  senderName: yup.string().trim().required("Sender name is required"),
  senderEmail: yup.string().trim().required("Sender email is required").email("Please enter a valid email address"),
});

export const EMAIL_SETTINGS_DEFAULTS = {
  smtpHost: "smtp.estately.example",
  smtpPort: 587,
  senderName: "Estately",
  senderEmail: "no-reply@estately.example",
};

// ---- SMS ----
export const smsSettingsSchema = yup.object({
  smsProvider: yup.string().required("Please select a provider"),
  senderId: yup
    .string()
    .trim()
    .required("Sender ID is required")
    .max(6, "Sender ID should be 6 characters or fewer"),
  apiKey: yup.string().trim().required("API key is required"),
});

export const SMS_SETTINGS_DEFAULTS = {
  smsProvider: "Twilio",
  senderId: "ESTATE",
  apiKey: "sk_live_51H8x9J2p3q4r5s6t",
};

// ---- Security ----
export const securitySettingsSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Include at least one uppercase letter")
    .matches(/[0-9]/, "Include at least one number"),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

export const SECURITY_SETTINGS_DEFAULTS = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// ---- SEO ----
export const seoSettingsSchema = yup.object({
  metaTitle: yup.string().trim().required("Meta title is required").max(70, "Keep it under 70 characters"),
  metaDescription: yup
    .string()
    .trim()
    .required("Meta description is required")
    .max(160, "Keep it under 160 characters"),
  keywords: yup.string().trim().required("Add at least one keyword"),
});

export const SEO_SETTINGS_DEFAULTS = {
  metaTitle: "Estately — Find Your Perfect Property in India",
  metaDescription: "Browse verified apartments, villas, plots and commercial spaces across India's top cities on Estately.",
  keywords: "real estate, property, apartments, villas, India",
};

// ---- Payment ----
export const paymentSettingsSchema = yup.object({
  paymentGateway: yup.string().required("Please select a gateway"),
  merchantId: yup.string().trim().required("Merchant ID is required"),
  currency: yup.string().required("Please select a currency"),
  testMode: yup.boolean().default(true),
});

export const PAYMENT_SETTINGS_DEFAULTS = {
  paymentGateway: "Razorpay",
  merchantId: "MID-EST-88214",
  currency: "INR",
  testMode: true,
};

// ---- Social Media ----
export const socialMediaSettingsSchema = yup.object({
  facebookUrl: yup.string().trim().url(URL_MESSAGE).nullable().transform((v) => (v ? v : null)),
  twitterUrl: yup.string().trim().url(URL_MESSAGE).nullable().transform((v) => (v ? v : null)),
  instagramUrl: yup.string().trim().url(URL_MESSAGE).nullable().transform((v) => (v ? v : null)),
  linkedinUrl: yup.string().trim().url(URL_MESSAGE).nullable().transform((v) => (v ? v : null)),
});

export const SOCIAL_MEDIA_SETTINGS_DEFAULTS = {
  facebookUrl: "https://facebook.com/estately",
  twitterUrl: "https://x.com/estately",
  instagramUrl: "https://instagram.com/estately",
  linkedinUrl: "https://linkedin.com/company/estately",
};

// ---- Profile ----
export const profileSchema = yup.object({
  name: yup.string().trim().required("Full name is required").min(3, "Name should be at least 3 characters"),
  email: yup.string().trim().required("Email is required").email("Please enter a valid email address"),
  avatarUrl: yup.string().trim().required("Avatar URL is required").url(URL_MESSAGE),
});
