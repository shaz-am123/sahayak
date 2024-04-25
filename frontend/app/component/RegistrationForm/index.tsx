import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { handleRegistration, isUniqueUsername } from "../../api/auth";
import styles from "./styles.module.scss";

export default function RegistrationForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState<boolean>(true);
  const [isPasswordMatching, setIsPasswordMatching] = useState<boolean>(true);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = async (username: string) => {
    return (await isUniqueUsername(username)).isUnique;
  };

  const registerUser = async () => {
    const isValidEmail = validateEmail(emailAddress);
    const isValidPassword = validatePassword(password);
    const isPasswordMatching = confirmPassword === password;
    const isValidUsername = await validateUsername(username);

    setIsValidEmail(isValidEmail);
    setIsValidPassword(isValidPassword);
    setIsPasswordMatching(isPasswordMatching);
    setIsValidUsername(isValidUsername);

    if (
      isValidUsername &&
      isValidEmail &&
      isValidPassword &&
      isPasswordMatching
    ) {
      await handleRegistration(
        {
          username: username,
          name: name,
          emailAddress: emailAddress,
          password: password,
        },
        router,
      );
    }
  };

  return (
    <div className={styles.formContainer} data-testid="registrationForm">
      <h1 data-testid="heading">Register</h1>
      <label htmlFor="username">Username</label>
      <InputText
        className={styles.inputField}
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {!isValidUsername && (
        <p className={styles.fieldError}>Username should be unique</p>
      )}

      <label htmlFor="name">Name</label>
      <InputText
        className={styles.inputField}
        keyfilter={"alpha"}
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="emailAddress">Email</label>
      <InputText
        className={`${!isValidEmail ? "p-invalid" : ""} ${styles.inputField}`}
        id="emailAddress"
        value={emailAddress}
        onChange={(e) => {
          setEmailAddress(e.target.value);
        }}
      />
      {!isValidEmail && (
        <p className={styles.fieldError}>Invalid Email address</p>
      )}

      <label htmlFor="password">Password</label>
      <InputText
        id="password"
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        value={password}
        className={`${!isValidPassword ? "p-invalid" : ""} ${styles.inputField}`}
      />
      {!isValidPassword && (
        <p className={styles.fieldError}>
          Password must include 8 letters with at least 1 uppercase, 1
          lowercase, 1 number, and 1 special character
        </p>
      )}

      <label htmlFor="confirm-password">Confirm Password</label>
      <InputText
        id="confirm-password"
        type="password"
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
        value={confirmPassword}
        className={`${!isValidPassword ? "p-invalid" : ""} ${styles.inputField}`}
      />
      {!isPasswordMatching && (
        <p className={styles.fieldError}>Passwords do not match!</p>
      )}

      <Button
        label="Register"
        onClick={registerUser}
        className={styles.button}
      />
    </div>
  );
}
