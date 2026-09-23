import * as yup from "yup";

export const SERVICE_STATUSES = ["Active", "Inactive"];

export const serviceSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Service name is required")
    .min(3, "Name should be at least 3 characters"),
  price: yup
    .number()
    .typeError("Price is required")
    .required("Price is required")
    .moreThan(0, "Price must be greater than 0"),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(20, "Description should be at least 20 characters"),
  status: yup.string().required("Please select a status"),
});

export const SERVICE_DEFAULT_VALUES = {
  name: "",
  price: "",
  description: "",
  status: "Active",
};
