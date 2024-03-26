import LoginRequest from "dto/LoginRequest";
import authService from "../services/AuthService";
import HttpResponse from "../dto/HttpResponse";

class AuthController {
  async login(loginRequest: LoginRequest): Promise<HttpResponse> {
    try {
      const loginResponse = await authService.login(loginRequest);
      return new HttpResponse(200, loginResponse);
    } catch (error) {
      return new HttpResponse(500, {
        error: "Login failed",
      });
    }
  }
}

export default new AuthController();
