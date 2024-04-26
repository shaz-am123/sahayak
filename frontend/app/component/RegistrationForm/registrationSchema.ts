import * as Yup from "yup";
import { isUniqueUsername } from "../../api/auth";

const registrationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .test("is-unique", "Username already exists", async function (value) {
      if (!value) return true;
      const response = await isUniqueUsername(value);
      return response.isUnique;
    }),
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  emailAddress: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
      "Password must contain at least one special character",
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default registrationSchema;
