import { InputText } from "primereact/inputtext";
import styles from "./styles.module.css";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleLogin } from "../../api/auth/AuthService";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.formContainer} data-testid="loginForm">
      <h1 data-testid = "heading">Login</h1>
      <label htmlFor="username">Username</label>
      <InputText
        className={styles.inputField}
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <InputText
        className={styles.inputField}
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        label="Login"
        severity="success"
        onClick={() => handleLogin(username, password, router)}
        className={styles.button}
      />
    </div>
  );
}
