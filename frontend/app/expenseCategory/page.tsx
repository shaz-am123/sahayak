"use client";
import { Button } from "primereact/button";
import { useState } from "react";
import ProtectedContent from "../component/ProtectedContent";

export default function ExpenseCategory() {
  const pageContent = (
    <>
      <h2>Expense Category page</h2>
    </>
  );
  return <ProtectedContent pageContent={pageContent} />;
}
