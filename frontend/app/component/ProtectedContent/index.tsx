import React, { useEffect, useState } from "react";
import AccessDenied from "../AccessDenied";
import Navbar from "../Navbar";
import styles from "./styles.module.scss";
import { isAuthenticated } from "../../api/auth";

interface ProtectedContentProps {
  pageContent: JSX.Element;
  alternateContent?: JSX.Element;
}
export default function ProtectedContent({
  pageContent,
  alternateContent = <AccessDenied />,
}: ProtectedContentProps) {
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  useEffect(() => {
    isAuthenticated().then((res) => {
      setAuthenticated(res);
    });
  }, [authenticated]);

  if (!authenticated) return alternateContent;

  return (
    <>
      <Navbar />
      <div className={styles.pageContentContainer}>{pageContent}</div>
    </>
  );
}
