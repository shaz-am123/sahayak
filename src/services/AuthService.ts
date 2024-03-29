import LoginRequest from "dto/LoginRequest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import authRepository from "../repositories/AuthRepository";
import LoginResponse from "../dto/LoginResponse";
import RegistrationRequest from "dto/RegistrationRequest";
import RegistrationResponse from "dto/RegistrationResponse";
import User from "domain/User";

class AuthService {
  async registerUser(registrationRequest: RegistrationRequest): Promise<RegistrationResponse> {
    const hashedPassword = await bcrypt.hash(registrationRequest.password, 10);
    const user = new User(null, registrationRequest.name, registrationRequest.username, hashedPassword)
    const registeredUser =  await authRepository.createUser(user);
    return new RegistrationResponse(registeredUser.id!, registeredUser.name, registeredUser.username)
  }
  
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { username, password } = loginRequest;
    const user = await authRepository.getUserByUsername(username);
    
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

const authService = new AuthService();
export default authService;
