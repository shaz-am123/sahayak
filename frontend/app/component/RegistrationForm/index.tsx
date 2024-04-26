import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleRegistration, isUniqueUsername } from "../../api/auth";
import styles from "./styles.module.scss";
import { useFormik } from "formik";
import registrationSchema from "./registrationSchema";

export default function RegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        username: "",
        name: "",
        emailAddress: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: registrationSchema,
      onSubmit: (values, action) => {
        setLoading(true);
        handleRegistration({ ...values }, router).then(() => {
          action.resetForm();
          setLoading(false);
        });
      },
    });

  return (
    <form
      className={styles.formContainer}
      data-testid="registrationForm"
      onSubmit={handleSubmit}
    >
      <h2 data-testid="heading">Register</h2>
      <label className={styles.fieldLabel} htmlFor="username">
        Username
      </label>
      <InputText
        id="username"
        autoComplete="off"
        onChange={handleChange}
        value={values.username}
        onBlur={handleBlur}
        className={`${errors.username && touched.username ? "p-invalid" : ""} ${styles.inputField}`}
      />
      {errors.username && touched.username && (
        <p className={styles.fieldError}>{errors.username}</p>
      )}

      <label className={styles.fieldLabel} htmlFor="name">
        Name
      </label>
      <InputText
        keyfilter={"alpha"}
        id="name"
        autoComplete="off"
        value={values.name}
        onBlur={handleBlur}
        className={`${errors.name && touched.name ? "p-invalid" : ""} ${styles.inputField}`}
        onChange={handleChange}
      />
      {errors.name && touched.name && (
        <p className={styles.fieldError}>{errors.name}</p>
      )}

      <label className={styles.fieldLabel} htmlFor="emailAddress">
        Email
      </label>
      <InputText
        id="emailAddress"
        autoComplete="off"
        value={values.emailAddress}
        onBlur={handleBlur}
        className={`${errors.emailAddress && touched.emailAddress ? "p-invalid" : ""} ${styles.inputField}`}
        onChange={handleChange}
      />
      {errors.emailAddress && touched.emailAddress ? (
        <p className={styles.fieldError}>{errors.emailAddress}</p>
      ) : null}

      <label className={styles.fieldLabel} htmlFor="password">
        Password
      </label>
      <InputText
        id="password"
        type="password"
        onChange={handleChange}
        onBlur={handleBlur}
        className={`${errors.password && touched.password ? "p-invalid" : ""} ${styles.inputField}`}
        value={values.password}
      />
      {errors.password && touched.password ? (
        <p className={styles.fieldError}>{errors.password}</p>
      ) : null}

      <label className={styles.fieldLabel} htmlFor="confirmPassword">
        Confirm Password
      </label>
      <InputText
        id="confirmPassword"
        type="password"
        onChange={handleChange}
        onBlur={handleBlur}
        className={`${errors.confirmPassword && touched.confirmPassword ? "p-invalid" : ""} ${styles.inputField}`}
        value={values.confirmPassword}
      />
      {errors.confirmPassword && touched.confirmPassword ? (
        <p className={styles.fieldError}>{errors.confirmPassword}</p>
      ) : null}

      <Button
        label={loading ? "..." : "Register"}
        type="submit"
        className={styles.button}
      />
    </form>
  );
}
