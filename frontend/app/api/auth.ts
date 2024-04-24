import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const BACKEND_SERVICE_URL =
  process.env.BACKEND_SERVICE_URL || "http://localhost:8080";
export const handleLogin = async (
  username: string,
  password: string,
  router: AppRouterInstance,
) => {
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
    router.push("/home");
  }
};

export const handleLogout = async (router: AppRouterInstance) => {
  localStorage.removeItem("token");
  router.push("/");
};

export const handleRegistration = async (
  username: string,
  name: string,
  emailAddress: string,
  password: string,
  router: AppRouterInstance,
) => {
  const res = await fetch(`${BACKEND_SERVICE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      name: name,
      emailAddress: emailAddress,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) alert("Registration failed");
  else {
    handleLogin(username, password, router);
  }
};

export const getUser = async () => {
  const res = await fetch(`${BACKEND_SERVICE_URL}/auth/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")!,
    },
  });

  if (!res.ok) alert("Couldn't find user");
  else {
    const data = await res.json();
    return data;
  }
};
