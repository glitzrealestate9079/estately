import * as yup from "yup";

export const PROJECT_TYPES = ["Residential", "Commercial", "Mixed-Use", "Villa Township", "Plotted Development"];

export const PROJECT_STATUSES = ["Upcoming", "New Launch", "Under Construction", "Ready to Move", "Completed"];

export const projectSchema = yup.object({
  projectName: yup
    .string()
    .trim()
    .required("Project name is required")
    .min(4, "Project name should be at least 4 characters"),
  developer: yup.string().trim().required("Developer name is required"),
  city: yup.string().required("Please select a city"),
  locality: yup.string().trim().required("Locality is required"),
  projectType: yup.string().required("Please select a project type"),
  status: yup.string().required("Please select a status"),
  totalUnits: yup
    .number()
    .typeError("Total units is required")
    .required("Total units is required")
    .integer("Must be a whole number")
    .moreThan(0, "Total units must be greater than 0"),
  availableUnits: yup
    .number()
    .typeError("Available units is required")
    .required("Available units is required")
    .integer("Must be a whole number")
    .min(0, "Cannot be negative")
    .test("not-more-than-total", "Cannot exceed total units", function (value) {
      const { totalUnits } = this.parent;
      if (value == null || totalUnits == null || Number.isNaN(totalUnits)) return true;
      return value <= totalUnits;
    }),
  startingPrice: yup
    .number()
    .typeError("Starting price is required")
    .required("Starting price is required")
    .moreThan(0, "Starting price must be greater than 0"),
  possessionDate: yup.string().required("Possession date is required"),
  reraNumber: yup.string().nullable(),
  amenities: yup.array().of(yup.string()).default([]),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(30, "Description should be at least 30 characters"),
  images: yup.array().min(1, "Please add at least one project image").required(),
});

export const PROJECT_DEFAULT_VALUES = {
  projectName: "",
  developer: "",
  city: "",
  locality: "",
  projectType: "",
  status: "Upcoming",
  totalUnits: "",
  availableUnits: "",
  startingPrice: "",
  possessionDate: "",
  reraNumber: "",
  amenities: [],
  description: "",
  images: [],
};
