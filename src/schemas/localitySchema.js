import * as yup from "yup";

export const localitySchema = yup.object({
  seoTitle: yup
    .string()
    .trim()
    .required("SEO title is required")
    .min(10, "SEO title should be at least 10 characters"),
  seoDescription: yup
    .string()
    .trim()
    .required("SEO description is required")
    .min(30, "SEO description should be at least 30 characters"),
  avgPricePerSqft: yup
    .number()
    .typeError("Average price per sqft is required")
    .required("Average price per sqft is required")
    .moreThan(0, "Average price per sqft must be greater than 0"),
  rentRangeMin: yup
    .number()
    .typeError("Minimum rent is required")
    .required("Minimum rent is required")
    .moreThan(0, "Minimum rent must be greater than 0"),
  rentRangeMax: yup
    .number()
    .typeError("Maximum rent is required")
    .required("Maximum rent is required")
    .test("not-less-than-min", "Maximum rent cannot be less than minimum rent", function (value) {
      const { rentRangeMin } = this.parent;
      if (value == null || rentRangeMin == null || Number.isNaN(rentRangeMin)) return true;
      return value >= rentRangeMin;
    }),
  dataPeriod: yup.string().trim().required("Data period is required"),
});

export const LOCALITY_DEFAULT_VALUES = {
  seoTitle: "",
  seoDescription: "",
  avgPricePerSqft: "",
  rentRangeMin: "",
  rentRangeMax: "",
  dataPeriod: "",
};
