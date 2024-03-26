import LoginRequest from "dto/LoginRequest";
import authService from "../services/AuthService";

const login = async (loginRequest: LoginRequest) => {
  try {
    const token = await authService.login(loginRequest);
    return {
      status: 200,
      body:{
        token: token,
      }
    }
  } catch (error) {
    return {
      status: 200,
      body:{
        error: "Login failed",
      }
    }
  }
};

export default { login };
