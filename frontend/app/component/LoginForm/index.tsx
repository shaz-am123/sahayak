import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { handleLogin } from "../../api/auth";
import styles from "./styles.module.scss";
import { useFormik } from "formik";
import loginSchema from "./loginSchema";
import PasswordInput from "../InputPassword";
import { Toast } from "primereact/toast";

export default function LoginForm() {
  const router = useRouter();
  const toast = useRef(null);

  const showAlert = (success: boolean, message: string) => {
    toast.current.show({
      severity: success ? "success" : "error",
      detail: message,
    });
  };
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
        handleLogin({ ...values }, router).then((response) => {
          action.resetForm();
          showAlert(response.success, response.message);
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
      <Toast ref={toast} />
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
      <PasswordInput
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
