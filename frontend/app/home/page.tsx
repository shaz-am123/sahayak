"use client";
import { useEffect, useState } from "react";
import ProtectedContent from "../component/ProtectedContent";
import UserResponse from "../types/UserResponse";
import { getUser } from "../api/auth";
import styles from "./styles.module.scss";

export default function Home() {
  const [user, setUser] = useState<UserResponse>();
  useEffect(() => {
    getUser().then((user: UserResponse) => {
        setUser(user);
    });
  }, []);
  const pageContent =
    user === undefined ? (
      <p>Loading</p>
    ) : (
      <>
        <div className={styles.greetingContainer}>
          <h1>Welcome {user.name}!</h1>
          <h3>
            Sahayak, your trusted partner for effortless money management.
            Simplify your finances and achieve your goals with confidence.
          </h3>
        </div>
      </>
    );
  return <ProtectedContent pageContent={pageContent} />;
}
