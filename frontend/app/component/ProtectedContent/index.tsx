import React from "react";
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
  if (!isAuthenticated()) return alternateContent;
  else
    return (
      <>
        <Navbar />
        <div className={styles.pageContentContainer}>{pageContent}</div>
      </>
    );
}
