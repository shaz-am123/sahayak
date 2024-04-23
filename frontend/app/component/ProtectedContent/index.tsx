import React from "react";
import AccessDenied from "../AccessDenied";
import Navbar from "../Navbar";

interface ProtectedContentProps{
  pageContent: JSX.Element,
  alternateContent?: JSX.Element
}
export default function ProtectedContent({
  pageContent,
  alternateContent = <AccessDenied />,
}: ProtectedContentProps) {
  const token = localStorage.getItem("token");
  if (!token) return alternateContent;
  else
    return (
      <>
        <Navbar />
        {pageContent}
      </>
    );
}
