import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import styles from "./styles.module.scss";

const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.passwordContainer}>
      <InputText
        {...props}
        type={showPassword ? "text" : "password"}
        data-testid="password-input"
      />
      <i
        className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} ${styles.showPasswordToggle}`}
        onClick={togglePasswordVisibility}
        data-testid="toggle-button"
      />
    </div>
  );
};

export default PasswordInput;
