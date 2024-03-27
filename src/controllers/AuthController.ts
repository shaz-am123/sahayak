import LoginRequest from "dto/LoginRequest";
import authService from "../services/AuthService";
import HttpResponse from "../dto/HttpResponse";
import { CustomValidationError } from "../../errors/CustomValidationError";

class AuthController {
  async login(loginRequest: LoginRequest): Promise<HttpResponse> {
    try {
      await loginRequest.validateRequest();
      const loginResponse = await authService.login(loginRequest);
      return new HttpResponse(200, loginResponse);
    } catch (error) {
      if (error instanceof CustomValidationError) {
        return new HttpResponse(400, { error: error.validationErrors });
      }
      return new HttpResponse(500, {
        error: "Login failed",
      });
    }
  }
}

const authController = new AuthController();

export default authController;
