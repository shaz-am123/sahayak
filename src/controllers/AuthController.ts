import LoginRequest from "dto/LoginRequest";
import { AuthService } from "../services/AuthService";
import HttpResponse from "../dto/HttpResponse";
import { CustomValidationError } from "../errors/CustomValidationError";
import RegistrationRequest from "../dto/RegistrationRequest";

export class AuthController {
  private static instance: AuthController;
    private authService: AuthService;

    private constructor() {
        this.authService = AuthService.getInstance();
    }

    public static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }
    
  async registerUser(
    registrationRequest: RegistrationRequest
  ): Promise<HttpResponse> {
    try {
      await registrationRequest.validateRequest();
      const registeredResponse = await this.authService.registerUser(
        registrationRequest
      );
      return new HttpResponse(200, registeredResponse);
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  async login(loginRequest: LoginRequest): Promise<HttpResponse> {
    try {
      await loginRequest.validateRequest();
      const loginResponse = await this.authService.login(loginRequest);
      return new HttpResponse(200, loginResponse);
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  private handleErrors(error: any): HttpResponse {
    if (error instanceof CustomValidationError) {
      return new HttpResponse(400, { error: error.validationErrors });
    }
    return new HttpResponse(500, {
      error: error.message,
    });
  }
}
