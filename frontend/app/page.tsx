"use client";
import { Button } from "primereact/button";
import { useState } from "react";
import styles from "./signupPage.module.scss";
import LoginForm from "./component/LoginForm";
import RegistrationForm from "./component/RegistrationForm";

const LoginPage: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  return (
    <div>
      {isRegistered && (
        <>
          <LoginForm />
          <Button
            className={styles.registerationButton}
            label="New to Sahayak?"
            severity="info"
            rounded
            onClick={() => {
              setIsRegistered(false);
            }}
          />
        </>
      )}
      {!isRegistered && (
        <RegistrationForm />
      )}
    </div>
  );
};

export default LoginPage;
