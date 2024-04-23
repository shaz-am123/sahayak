import { isAuthenticated } from "../auth/AuthService";

const BACKEND_SERVICE_URL =
  process.env.BACKEND_SERVICE_URL || "http://localhost:8080";

export const getExpenses = async () => {
    if(!isAuthenticated())
        return;

  const res = await fetch(`${BACKEND_SERVICE_URL}/expenses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")!
    },
  });

  if (!res.ok) alert("Request failed");
  else {
    const data = await res.json();
    return data;
  }
};