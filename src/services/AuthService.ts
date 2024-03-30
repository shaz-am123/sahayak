import LoginRequest from "../dto/LoginRequest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthRepository } from "../repositories/AuthRepository";
import LoginResponse from "../dto/LoginResponse";
import RegistrationRequest from "../dto/RegistrationRequest";
import RegistrationResponse from "../dto/RegistrationResponse";
import User from "../domain/User";

export class AuthService {
    private static instance: AuthService;
    private authRepository: AuthRepository;

    private constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    public static getInstance(authRepository: AuthRepository = AuthRepository.getInstance()): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService(authRepository);
        }
        return AuthService.instance;
    }

  async registerUser(
    registrationRequest: RegistrationRequest
  ): Promise<RegistrationResponse> {
    const hashedPassword = await bcrypt.hash(registrationRequest.password, 10);
    const user = new User(
      null,
      registrationRequest.name,
      registrationRequest.emailAddress,
      registrationRequest.username,
      hashedPassword
    );
    const registeredUser = await this.authRepository.registerUser(user);
    return new RegistrationResponse(
      registeredUser.id!,
      registeredUser.name,
      registeredUser.emailAddress,
      registeredUser.username
    );
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { username, password } = loginRequest;
    const user = await this.authRepository.getUserByUsername(username);

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
      throw new Error("Authentication failed");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!!, {
      expiresIn: "1h",
    });

    return new LoginResponse(user.id!, user.username, token);
  }
}
