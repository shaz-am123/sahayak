import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleRegistration } from "../../api/auth/AuthService";
import styles from "./styles.module.css";

export default function RegistrationForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className={styles.formContainer}>
      <h1>Register</h1>
      <label htmlFor="username">Username</label>
      <InputText
        className={styles.inputField}
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="name">Name</label>
      <InputText
        className={styles.inputField}
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="emailAddress">Email</label>
      <InputText
        className={styles.inputField}
        id="emailAddress"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <InputText
        className={styles.inputField}
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label htmlFor="confirm-password">Confirm Password</label>
      <InputText
        className={styles.inputField}
        id="confirm-password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button
        label="Register"
        severity="success"
        onClick={() => {
          if (confirmPassword !== password) {
            alert("The passwords don't match");
          }
          handleRegistration(username, name, emailAddress, password, router);
        }}
        className={styles.button}
      />
    </div>
  );
}
