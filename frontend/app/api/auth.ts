import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import LoginRequest from "../types/LoginRequest";
import UserResponse from "../types/UserResponse";
import RegistraionRequest from "../types/RegistrationRequest";
import LoginResponse from "../types/LoginResponse";
import ApiResponse from "../types/ApiResponse";

const BACKEND_SERVICE_URL =
  process.env.BACKEND_SERVICE_URL || "http://localhost:8080";

export const handleLogin = async (
  loginRequest: LoginRequest,
  router: AppRouterInstance,
): Promise<ApiResponse> => {
  const res = await fetch(`${BACKEND_SERVICE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ ...loginRequest }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    return {
      success: false,
      message: errorResponse.error,
    };
  }
  const data: LoginResponse = await res.json();
  localStorage.setItem("token", data.token);
  router.push("/home");
  return {
    success: true,
    message: "Login successful",
  };
};

export const handleLogout = async (
  router: AppRouterInstance,
): Promise<void> => {
  localStorage.removeItem("token");
  router.push("/");
};

export const handleRegistration = async (
  registrationRequest: RegistraionRequest,
  router: AppRouterInstance,
): Promise<ApiResponse> => {
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
    return {
      success: false,
      message: errorResponse.error,
    };
  }
  const loginRequest: LoginRequest = { ...registrationRequest };
  handleLogin(loginRequest, router);
  return {
    success: true,
    message: "Registration successful",
  };
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
    throw new Error(`Couldn't get user: ${errorResponse.error}`);
  } else {
    const data = await res.json();
    return data;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    return localStorage.getItem("token") !== null;
  } catch (e) {
    return false;
  }
};

export const isUniqueUsername = async (
  username: string,
): Promise<{ isUnique: boolean }> => {
  const res = await fetch(
    `${BACKEND_SERVICE_URL}/auth/check-username?username=${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Server error");
  }

  return await res.json();
};
