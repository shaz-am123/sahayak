import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import LoginRequest from "../types/LoginRequest";
import UserResponse from "../types/UserResponse";
import RegistraionRequest from "../types/RegistrationRequest";
import LoginResponse from "../types/LoginResponse";
import RequestSuccessStatus from "../types/RequestSuccessStatus";

const BACKEND_SERVICE_URL =
  process.env.BACKEND_SERVICE_URL || "http://localhost:8080";

export const handleLogin = async (
  loginRequest: LoginRequest,
  router: AppRouterInstance,
): Promise<RequestSuccessStatus> => {
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
    } as RequestSuccessStatus;
  }
  const data: LoginResponse = await res.json();
  localStorage.setItem("token", data.token);
  router.push("/home");
  return {
    success: true,
    message: "Login Successful",
  } as RequestSuccessStatus;
};

export const handleLogout = async (
  router: AppRouterInstance,
): Promise<RequestSuccessStatus> => {
  localStorage.removeItem("token");
  router.push("/");
  return {
    success: true,
    message: "Logout Successful",
  } as RequestSuccessStatus;
};

export const handleRegistration = async (
  registrationRequest: RegistraionRequest,
  router: AppRouterInstance,
): Promise<RequestSuccessStatus> => {
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
      message: errorResponse.error
        ? errorResponse.error
        : "Internal Server Error",
    } as RequestSuccessStatus;
  }

  router.refresh();
  return {
    success: true,
    message: "Registration successful",
  } as RequestSuccessStatus;
};

export const getUser = async (): Promise<RequestSuccessStatus> => {
  const res = await fetch(`${BACKEND_SERVICE_URL}/auth/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")!,
    },
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    return {
      success: false,
      message: errorResponse.error
        ? errorResponse.error
        : "Internal Server Error",
    } as RequestSuccessStatus;
  }
  const data = await res.json();
  return {
    success: true,
    message: "User details retrieved successfully",
    data: data as UserResponse,
  } as RequestSuccessStatus;
};

export const isAuthenticated = async (): Promise<boolean> => {
  return localStorage.getItem("token") !== null;
};

export const isUniqueUsername = async (
  username: string,
): Promise<RequestSuccessStatus> => {
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
    alert("Server error");
    throw new Error("Server error");
  }

  return await res.json();
};
