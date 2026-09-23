import * as yup from "yup";

export const COUPON_DISCOUNT_TYPES = ["Percentage", "Fixed"];

export const COUPON_APPLICABLE_PLANS = ["All Plans", "Basic", "Pro", "Premium", "Enterprise"];

export const COUPON_STATUSES = ["Active", "Scheduled", "Expired", "Disabled"];

export const couponSchema = yup.object({
  code: yup
    .string()
    .trim()
    .required("Coupon code is required")
    .min(3, "Code should be at least 3 characters")
    .uppercase(),
  discountType: yup
    .string()
    .required("Please select a discount type")
    .oneOf(COUPON_DISCOUNT_TYPES, "Please select a valid discount type"),
  discountValue: yup
    .number()
    .typeError("Discount value is required")
    .required("Discount value is required")
    .moreThan(0, "Discount value must be greater than 0")
    .test("max-percentage", "Percentage discount cannot exceed 100", function (value) {
      const { discountType } = this.parent;
      if (discountType !== "Percentage" || value == null) return true;
      return value <= 100;
    }),
  minAmount: yup
    .number()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .min(0, "Cannot be negative"),
  maxDiscount: yup
    .number()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .min(0, "Cannot be negative"),
  validFrom: yup.string().required("Valid from date is required"),
  validUntil: yup
    .string()
    .required("Valid until date is required")
    .test("not-before-valid-from", "Valid until cannot be earlier than valid from", function (value) {
      const { validFrom } = this.parent;
      if (!value || !validFrom) return true;
      return new Date(value) >= new Date(validFrom);
    }),
  usageLimit: yup
    .number()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .integer("Must be a whole number")
    .min(1, "Must be at least 1"),
  perUserLimit: yup
    .number()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .integer("Must be a whole number")
    .min(1, "Must be at least 1")
    .default(1),
  applicablePlan: yup
    .string()
    .required("Please select an applicable plan")
    .oneOf(COUPON_APPLICABLE_PLANS, "Please select a valid plan"),
  status: yup
    .string()
    .required("Please select a status")
    .oneOf(COUPON_STATUSES, "Please select a valid status"),
});

export const COUPON_DEFAULT_VALUES = {
  code: "",
  discountType: "Percentage",
  discountValue: "",
  minAmount: "",
  maxDiscount: "",
  validFrom: "",
  validUntil: "",
  usageLimit: "",
  perUserLimit: 1,
  applicablePlan: "All Plans",
  status: "Active",
};
