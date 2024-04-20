"use client";
import { Button } from "primereact/button";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <>
      <h2>Home page</h2>
      <Button onClick={handleClick}>Click me</Button>
      <div>{count}</div>
    </>
  );
}
