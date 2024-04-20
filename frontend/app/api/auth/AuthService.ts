import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const BACKEND_SERVICE_URL =
  process.env.BACKEND_SERVICE_URL || "http://localhost:8080";
export const handleLogin = async (username: string, password: string, router: AppRouterInstance) => {
  const res = await fetch(`${BACKEND_SERVICE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) alert("Login failed");
  else {
    const data = await res.json();
    localStorage.setItem("token", data.token);
    router.push("/home")
  }
};

export const handleLogout = async (router: AppRouterInstance) =>{
    localStorage.removeItem("token");
    router.push("/")
}
