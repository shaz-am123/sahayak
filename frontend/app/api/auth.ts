import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import LoginRequest from "../types/LoginRequest";
import UserResponse from "../types/UserResponse";
import RegistraionRequest from "../types/RegistrationRequest";
import LoginResponse from "../types/LoginResponse";

const BACKEND_SERVICE_URL =
  process.env.BACKEND_SERVICE_URL || "http://localhost:8080";

export const handleLogin = async (
  loginRequest: LoginRequest,
  router: AppRouterInstance
): Promise<void> => {
  const res = await fetch(`${BACKEND_SERVICE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ ...loginRequest }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    alert(`Login failed: ${errorResponse.error}`);
  } else {
    const data: LoginResponse = await res.json();
    localStorage.setItem("token", data.token);
    router.push("/home");
  }
};

export const handleLogout = async (
  router: AppRouterInstance
): Promise<void> => {
  localStorage.removeItem("token");
  router.push("/");
};

export const handleRegistration = async (
  registrationRequest: RegistraionRequest,
  router: AppRouterInstance
): Promise<void> => {
  const res = await fetch(`${BACKEND_SERVICE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      ...registrationRequest,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    console.log(errorResponse.error);
  } else {
    const loginRequest: LoginRequest = { ...registrationRequest };
    handleLogin(loginRequest, router);
  }
};

export const getUser = async (): Promise<UserResponse> => {
  const res = await fetch(`${BACKEND_SERVICE_URL}/auth/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")!,
    },
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    alert(`Couldn't get user: ${errorResponse.error}`);
    throw new Error(`Couldn't get user: ${errorResponse.error}`);
  } else {
    const data = await res.json();
    return data;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  return localStorage.getItem("token") !== null;
};

export const isUniqueUsername = async (username: string): Promise<{isUnique: boolean}> => {
  const res = await fetch(`${BACKEND_SERVICE_URL}/auth/check-username?username=${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    alert("Server error");
    throw new Error("Server error");
  }

  return await res.json();
};
