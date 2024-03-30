import { AuthController } from "./../../src/controllers/AuthController";
import LoginRequest from "../../src/dto/LoginRequest";
import RegistrationRequest from "../../src/dto/RegistrationRequest";
import { CustomValidationError } from "../../src/errors/CustomValidationError";
import RegistrationResponse from "../../src/dto/RegistrationResponse";
import LoginResponse from "../../src/dto/LoginResponse";
import { AuthService } from "../../src/services/AuthService";

jest.mock("../../src/services/AuthService", () => ({
  AuthService: {
    getInstance: jest.fn(() => ({
      registerUser: jest.fn(),
      login: jest.fn(),
    })),
  },
}));

describe("Auth Controller tests", () => {
  const authServiceMock = AuthService.getInstance() as jest.Mocked<AuthService>
  const authController = AuthController.getInstance(authServiceMock);

  it("should handle login of a user", async () => {
    const loginRequest = new LoginRequest("ram123", "myPassword123");
    const expectedResponse = new LoginResponse("A001", "ram123", "mockToken");

    authServiceMock.login.mockResolvedValue(expectedResponse);

    const httpResponse = await authController.login(loginRequest);

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.status).toBe(200);
  });

  it("should handle registration of a user", async () => {
    const registrationRequest = new RegistrationRequest(
      "Ram",
      "ram@gmail.com",
      "ram123",
      "myPassword123"
    );
    const expectedResponse: RegistrationResponse = {...registrationRequest, id: "A001"};

    authServiceMock.registerUser.mockResolvedValue(expectedResponse);

    const httpResponse = await authController.registerUser(registrationRequest);

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.status).toBe(200);
  });

  it("should handle validation errors during user registration", async () => {
    const mockRegisterUserRequest = new RegistrationRequest(
      "ram",
      "ram@gmail.com",
      "",
      "myPass123"
    );
    const validationError = new CustomValidationError("Validation error", [
      {
        target: {
          name: "ram",
          emailAddress: "ram@gmail.com",
          username: "",
          password: "myPass123",
        },
        value: "",
        property: "username",
        children: [],
        constraints: {
          minLength: "Username must be at least 4 characters long",
          isNotEmpty: "Username is required",
        },
      },
    ]);

    authServiceMock.registerUser.mockRejectedValue(validationError);

    const httpResponse = await authController.registerUser(
      mockRegisterUserRequest
    );

    expect(httpResponse.body).toEqual({
      error: validationError.validationErrors,
    });
    expect(httpResponse.status).toBe(400);
  });

  it("should handle validation errors during user login", async () => {
    const mockLoginRequest = new LoginRequest("ram", "");
    const validationError = new CustomValidationError("Validation error", [
      {
        target: {
          username: "ram",
          password: "",
        },
        value: "",
        property: "password",
        children: [],
        constraints: {
          isNotEmpty: "Password is required",
        },
      },
    ]);

    authServiceMock.login.mockRejectedValue(validationError);

    const httpResponse = await authController.login(mockLoginRequest);

    expect(httpResponse.body).toEqual({
      error: validationError.validationErrors,
    });
    expect(httpResponse.status).toBe(400);
  });

  it("should handle other errors during user registration", async () => {
    const mockRegisterUserRequest = new RegistrationRequest(
      "ram",
      "ram@gmail.com",
      "ram123",
      "myPassword123"
    );
    const errorMessage = "Internal Server Error";
    const error = new Error(errorMessage);

    authServiceMock.registerUser.mockRejectedValue(error);

    const httpResponse = await authController.registerUser(
      mockRegisterUserRequest
    );

    expect(httpResponse.body).toEqual({ error: errorMessage });
    expect(httpResponse.status).toBe(500);
  });

  it("should handle other errors during user login", async () => {
    const mockLoginRequest = new LoginRequest("ram123", "myPassword123");
    const errorMessage = "Internal Server Error";
    const error = new Error(errorMessage);

    authServiceMock.login.mockRejectedValue(error);

    const httpResponse = await authController.login(mockLoginRequest);

    expect(httpResponse.body).toEqual({ error: errorMessage });
    expect(httpResponse.status).toBe(500);
  });
});
