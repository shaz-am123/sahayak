import React from "react";
import { Image } from "primereact/image";
import styles from "./styles.module.scss";

export default function AccessDenied() {
  return (
    <>
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
