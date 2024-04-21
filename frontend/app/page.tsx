"use client";
import React, { useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import styles from "./styles.module.scss";
import RegistrationForm from "./component/RegistrationForm";
import LoginForm from "./component/LoginForm";

export default function StartPage() {
  const [isNewUser, setIsNewUser] = useState(false);

  return (
    <div className={styles.formContainer}>
      <label className={styles.label} htmlFor="newUserCheckbox">
        New User?
      </label>
      <InputSwitch
        id="newUserCheckBox"
        checked={isNewUser}
        onChange={(e) => setIsNewUser(e.value)}
      />
      {isNewUser && <RegistrationForm />}
      {!isNewUser && <LoginForm />}
    </div>
  );
}
