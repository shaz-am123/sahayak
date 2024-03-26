import LoginRequest from "dto/LoginRequest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userRepository from "../repositories/UserRepository";
import LoginResponse from "../dto/LoginResponse";

class AuthService {
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { username, password } = loginRequest;
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      throw new Error("Authentication failed");
    }
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
      throw new Error("Authentication failed");
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!!, {
      expiresIn: "1h",
    });

    return new LoginResponse(user.id, user.username, token);
  }
}

export default new AuthService();
