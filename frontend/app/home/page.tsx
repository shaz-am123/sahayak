"use client";
import { Button } from "primereact/button";
import { useState } from "react";
import ProtectedContent from "../component/ProtectedContent";

export default function Home() {
  const pageContent = (
    <>
      <h2>Home page</h2>
    </>
  );
  return (
    <ProtectedContent
      pageContent={pageContent}
    />
  );
}
