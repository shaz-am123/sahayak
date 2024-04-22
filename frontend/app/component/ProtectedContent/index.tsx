import React from "react";
import AccessDenied from "../AccessDenied";
import Navbar from "../Navbar";

export default function ProtectedContent({
  pageContent,
  alternateContent = <AccessDenied />,
}) {
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
