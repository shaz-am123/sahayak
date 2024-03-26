import LoginRequest from "dto/LoginRequest";
import authService from "../services/AuthService";

class AuthController {
  async login(loginRequest: LoginRequest) {
    try {
      const token = await authService.login(loginRequest);
      return {
        status: 200,
        body: {
          token: token,
        },
      };
    } catch (error) {
      return {
        status: 200,
        body: {
          error: "Login failed",
        },
      };
    }
  }
}

export default new AuthController();
