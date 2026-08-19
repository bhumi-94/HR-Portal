import * as yup from "yup";

export const signupSchema = yup.object({
  firstname: yup
    .string()
    .trim()
    .required("First name is required"),

  lastname: yup
    .string()
    .trim()
    .required("Last name is required"),

  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),

  personal_email: yup
    .string()
    .trim()
    .email("Enter a valid personal email")
    .required("Personal email is required"),

  working_email: yup
    .string()
    .trim()
    .email("Enter a valid working email")
    .nullable()
    .transform((value) => (value === "" ? null : value)),

  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  address: yup
    .string()
    .trim()
    .required("Address is required"),

  gender: yup
    .string()
    .required("Gender is required"),

  department: yup
    .string()
    .trim()
    .required("Department is required"),

  job_title: yup
    .string()
    .trim()
    .required("Job title is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),

  terms: yup
    .boolean()
    .oneOf([true], "You must accept the Terms and Conditions"),
});