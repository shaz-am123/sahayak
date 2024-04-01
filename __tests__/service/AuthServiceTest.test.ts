import { AuthService } from "./../../src/services/AuthService";
import { AuthRepository } from "./../../src/repositories/AuthRepository";
import LoginResponse from "../../src/dto/LoginResponse";
import LoginRequest from "../../src/dto/LoginRequest";
import User from "../../src/domain/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RegistrationRequest from "../../src/dto/RegistrationRequest";
import RegistrationResponse from "../../src/dto/RegistrationResponse";

jest.mock("../../src/repositories/AuthRepository", () => ({
  AuthRepository: {
    getInstance: jest.fn(() => ({
      registerUser: jest.fn(),
      getUserByUsername: jest.fn(),
      getUserById: jest.fn(),
    })),
  },
}));

jest.mock("bcrypt");

jest.mock("jsonwebtoken");

describe("Auth Service tests", () => {
  const authRepositoryMock =
    AuthRepository.getInstance() as jest.Mocked<AuthRepository>;
  const authService = AuthService.getInstance(authRepositoryMock);

  it("should handle login of a user", async () => {
    (bcrypt.compare as jest.Mock).mockImplementation(() => {
      return true;
    });
    (jwt.sign as jest.Mock).mockImplementation(() => {
      return "mockToken";
    });
    const loginRequest = new LoginRequest({
      username: "ram123",
      password: "myPass123",
    });
    const userResponse = new User({
      id: "A001",
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
      hashedPassword: "mockHashedPassword",
    });
    const expectedLoginResponse = new LoginResponse({
      id: "A001",
      username: "ram123",
      token: "mockToken",
    });

    authRepositoryMock.getUserByUsername.mockResolvedValue(userResponse);
    const loginResponse = await authService.login(loginRequest);
    expect(loginResponse).toEqual(expectedLoginResponse);
  });

  it("should handle registration of a user", async () => {
    const registrationRequest = new RegistrationRequest({
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
      password: "myPass123",
    });
    const expectedRegistrationResponse = new RegistrationResponse({
      id: "A001",
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
    });

    const mockUserResponse = new User({
      id: "A001",
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
      hashedPassword: "mockHashedPassword",
    });

    (bcrypt.hash as jest.Mock).mockImplementation(() => {
      return "mockHashedPassword";
    });

    authRepositoryMock.registerUser.mockResolvedValue(mockUserResponse);
    const registrationResponse = await authService.registerUser(
      registrationRequest
    );
    expect(registrationResponse).toEqual(expectedRegistrationResponse);
  });

  it("should handle errors during user registration", async () => {
    const registrationRequest = new RegistrationRequest({
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
      password: "myPass123",
    });

    (bcrypt.hash as jest.Mock).mockImplementation(() => {
      return "mockHashedPassword";
    });

    const serverError = new Error("Internal Server Error");
    authRepositoryMock.registerUser.mockRejectedValue(serverError);

    try {
      await authService.registerUser(registrationRequest);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Internal Server Error");
    }
  });

  it("should handle userNotFound error during user login", async () => {
    (bcrypt.compare as jest.Mock).mockImplementation(() => {
      return true;
    });

    const loginRequest = new LoginRequest({
      username: "ram123",
      password: "myPass123",
    });

    const userNotFoundError = new Error("User not found, invalid username");
    authRepositoryMock.getUserByUsername.mockRejectedValue(userNotFoundError);

    try {
      await authService.login(loginRequest);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("User not found, invalid username");
    }
  });

  it("should handle password mismatch error during user login", async () => {
    const loginRequest = new LoginRequest({
      username: "ram123",
      password: "myPass123",
    });
    const userResponse = new User({
      id: "A001",
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
      hashedPassword: "mockHashedPassword",
    });

    authRepositoryMock.getUserByUsername.mockResolvedValue(userResponse);
    (bcrypt.compare as jest.Mock).mockImplementation(() => {
      return false;
    });

    try {
      await authService.login(loginRequest);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Authentication failed");
    }
  });

  it("should throw an error if the userId is invalid or does not exist", async () => {
    const userNotFoundError = new Error("User not found, invalid userId");
    authRepositoryMock.getUserById.mockRejectedValue(userNotFoundError);
    try {
      await authService.validateUserId("A000");
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("User not found, invalid userId");
    }
  });
});
