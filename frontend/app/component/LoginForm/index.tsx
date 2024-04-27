import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleLogin } from "../../api/auth";
import styles from "./styles.module.scss";
import { useFormik } from "formik";
import loginSchema from "./loginSchema";

export default function RegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: (values, action) => {
        setLoading(true);
        handleLogin({ ...values }, router).then(() => {
          action.resetForm();
          setLoading(false);
        });
      },
    });

  return (
    <form
      className={styles.formContainer}
      data-testid="loginForm"
      onSubmit={handleSubmit}
    >
      <h2 data-testid="heading">Login</h2>
      <label
        className={`${styles.fieldLabel} ${styles.requiredField}`}
        htmlFor="username"
      >
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

      <label
        className={`${styles.fieldLabel} ${styles.requiredField}`}
        htmlFor="password"
      >
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

      <Button
        label={loading ? "..." : "Login"}
        type="submit"
        className={styles.button}
      />
    </form>
  );
}
