"use client";
import ProtectedContent from "../component/ProtectedContent";

export default function Expense() {
  const pageContent = (
    <>
      <h2>Expense page</h2>
    </>
  );
  return <ProtectedContent pageContent={pageContent} />;
}
