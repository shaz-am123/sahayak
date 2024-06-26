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
      validateUserId: jest.fn(),
      checkUsernameUniqueness: jest.fn(),
    })),
  },
}));

describe("Auth Controller tests", () => {
  const authServiceMock = AuthService.getInstance() as jest.Mocked<AuthService>;
  const authController = AuthController.getInstance(authServiceMock);

  it("should handle login of a user", async () => {
    const loginRequest = new LoginRequest({
      username: "ram123",
      password: "myPassword123!",
    });
    const expectedResponse = new LoginResponse({
      id: "A001",
      username: "ram123",
      token: "mockToken",
    });

    authServiceMock.login.mockResolvedValue(expectedResponse);

    const httpResponse = await authController.login(loginRequest);

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(200);
  });

  it("should handle registration of a user", async () => {
    const registrationRequest = new RegistrationRequest({
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
      password: "myPassword123!",
    });
    const expectedResponse: RegistrationResponse = {
      ...registrationRequest,
      id: "A001",
    };

    authServiceMock.registerUser.mockResolvedValue(expectedResponse);

    const httpResponse = await authController.registerUser(registrationRequest);

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(201);
  });

  it("should handle validation errors during user registration", async () => {
    const mockRegisterUserRequest = new RegistrationRequest({
      name: "ram",
      emailAddress: "ram@gmail.com",
      username: "",
      password: "myPassword123!",
    });
    const validationError = new CustomValidationError("Validation error", [
      {
        target: {
          name: "ram",
          emailAddress: "ram@gmail.com",
          username: "",
          password: "myPassword123!",
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

    const httpResponse = await authController.registerUser(
      mockRegisterUserRequest,
    );

    expect(httpResponse.body).toEqual({
      error: validationError.validationErrors,
    });
    expect(httpResponse.statusCode).toBe(400);
  });

  it("should handle validation errors during user login", async () => {
    const mockLoginRequest = new LoginRequest({
      username: "ram",
      password: "",
    });
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

    const httpResponse = await authController.login(mockLoginRequest);

    expect(httpResponse.body).toEqual({
      error: validationError.validationErrors,
    });
    expect(httpResponse.statusCode).toBe(400);
  });

  it("should handle other errors during user registration", async () => {
    const mockRegisterUserRequest = new RegistrationRequest({
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
      password: "myPassword123!",
    });
    const errorMessage = "Internal Server Error";
    const error = new Error(errorMessage);

    authServiceMock.registerUser.mockRejectedValue(error);

    const httpResponse = await authController.registerUser(
      mockRegisterUserRequest,
    );

    expect(httpResponse.body).toEqual({ error: errorMessage });
    expect(httpResponse.statusCode).toBe(500);
  });

  it("should handle other errors during user login", async () => {
    const mockLoginRequest = new LoginRequest({
      username: "ram123",
      password: "myPassword123!",
    });
    const errorMessage = "Internal Server Error";
    const error = new Error(errorMessage);

    authServiceMock.login.mockRejectedValue(error);

    const httpResponse = await authController.login(mockLoginRequest);

    expect(httpResponse.body).toEqual({ error: errorMessage });
    expect(httpResponse.statusCode).toBe(500);
  });

  it("should be able to get details of a user", async () => {
    const userId = "A001";
    const expectedResponse = new RegistrationResponse({
      id: userId,
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
    });
    authServiceMock.validateUserId.mockResolvedValue(expectedResponse);

    const httpResponse = await authController.getUser(userId);

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(200);
  });

  it("should be able to handle any error that occurs while getting details of a user", async () => {
    const userId = "A001";
    const mockUserResponse = new RegistrationResponse({
      id: userId,
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
    });
    const serverError = new Error("Internal Server Error");
    authServiceMock.validateUserId.mockRejectedValue(serverError);

    const httpResponse = await authController.getUser(userId);

    expect(httpResponse.body).toEqual({ error: serverError.message });
    expect(httpResponse.statusCode).toBe(500);
  });

  it("should be able to check whether an username is unique or not", async () => {
    const username = "ram123";
    const expectedResponse = {
      isUnique: true,
    };
    authServiceMock.checkUsernameUniqueness.mockResolvedValue(expectedResponse);

    const httpResponse =
      await authController.checkUsernameUniquesness(username);

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(200);
  });

  it("should be able to handle any error that occurs while checking the uniqueness of an username", async () => {
    const username = "ram123";
    const serverError = new Error("Internal Server Error");
    authServiceMock.checkUsernameUniqueness.mockRejectedValue(serverError);

    const httpResponse =
      await authController.checkUsernameUniquesness(username);

    expect(httpResponse.body).toEqual({ error: serverError.message });
    expect(httpResponse.statusCode).toBe(500);
  });
});
