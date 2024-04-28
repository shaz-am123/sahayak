"use client";
import React from "react";
import styles from "./styles.module.scss";
import ProtectedContent from "../../component/ProtectedContent";
import ExpenseForm from "../../component/ExpenseForm";

export default function AddExpense() {
  const pageContent = (
    <div
      className={styles.formContainer}
      data-testid="add-expense-form"
    >
      <ExpenseForm />
    </div>
  );

  return <ProtectedContent pageContent={pageContent} />;
}
