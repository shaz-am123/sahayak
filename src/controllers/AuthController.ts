import LoginRequest from "dto/LoginRequest";
import authService from "../services/AuthService";
import HttpResponse from "../dto/HttpResponse";
import { CustomValidationError } from "../errors/CustomValidationError";
import RegistrationRequest from "dto/RegistrationRequest";

class AuthController {
  async registerUser(
    registrationRequest: RegistrationRequest
  ): Promise<HttpResponse> {
    try {
      await registrationRequest.validateRequest();
      const registeredResponse = await authService.registerUser(
        registrationRequest
      );
      return new HttpResponse(200, registeredResponse);
    } catch (error) {
      return this.handleErrors(error)
    }
  }

  async login(loginRequest: LoginRequest): Promise<HttpResponse> {
    try {
      await loginRequest.validateRequest();
      const loginResponse = await authService.login(loginRequest);
      return new HttpResponse(200, loginResponse);
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  private handleErrors(error: any): HttpResponse
  {
      if (error instanceof CustomValidationError) {
        return new HttpResponse(400, { error: error.validationErrors });
      }
      return new HttpResponse(500, {
        error: error.message,
      });
  }
}

const authController = new AuthController();

export default authController;
