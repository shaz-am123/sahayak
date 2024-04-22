"use client";
import { Button } from "primereact/button";
import { useState } from "react";
import ProtectedContent from "../component/ProtectedContent";

export default function Dashboard() {
  const pageContent = (
    <>
      <h2>Dashboard page</h2>
    </>
  );
  return <ProtectedContent pageContent={pageContent} />;
}
