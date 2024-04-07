import LoginRequest from "../dto/LoginRequest";
import { AuthService } from "../services/AuthService";
import HttpResponse from "../dto/HttpResponse";
import { CustomValidationError } from "../errors/CustomValidationError";
import RegistrationRequest from "../dto/RegistrationRequest";
import validateRequest from "../dto/ValidateRequestDto";

export class AuthController {
  private static instance: AuthController;
  private authService: AuthService;

  private constructor(authService: AuthService) {
    this.authService = authService;
  }

  public static getInstance(
    authService: AuthService = AuthService.getInstance(),
  ): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController(authService);
    }
    return AuthController.instance;
  }

  async registerUser(
    registrationRequest: RegistrationRequest,
  ): Promise<HttpResponse> {
    try {
      await validateRequest(registrationRequest);
      const registeredResponse =
        await this.authService.registerUser(registrationRequest);
      return new HttpResponse({ statusCode: 201, body: registeredResponse });
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  async login(loginRequest: LoginRequest): Promise<HttpResponse> {
    try {
      await validateRequest(loginRequest);
      const loginResponse = await this.authService.login(loginRequest);
      return new HttpResponse({ statusCode: 200, body: loginResponse });
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  private handleErrors(error: any): HttpResponse {
    if (error instanceof CustomValidationError) {
      return new HttpResponse({
        statusCode: 400,
        body: { error: error.validationErrors },
      });
    }
    return new HttpResponse({
      statusCode: 500,
      body: {
        error: error.message,
      },
    });
  }
}
