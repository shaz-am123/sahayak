import React from "react";
import { Image } from "primereact/image";
import styles from "./styles.module.scss";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function AccessDenied() {
  const router = useRouter();
  return (
    <>
      <Button
        data-testid="login-button"
        label="Login to Access page"
        className={styles.loginButton}
        onClick={() => router.push("/")}
      />
      <Image
        src="/assets/access-denied.png"
        alt="access-denied-blob"
        width="600"
        height="600"
        className={styles.accessDeniedBlob}
      />
    </>
  );
}
