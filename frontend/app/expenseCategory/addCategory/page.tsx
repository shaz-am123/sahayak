"use client";
import React from "react";
import styles from "./styles.module.scss";
import ExpenseCategoryForm from "../../component/ExpenseCategoryForm";
import ProtectedContent from "../../component/ProtectedContent";

export default function AddCategory() {
  const pageContent = (
    <div
      className={styles.formContainer}
      data-testid="add-expenseCategory-form"
    >
      <ExpenseCategoryForm />
    </div>
  );

  return <ProtectedContent pageContent={pageContent} />;
}
