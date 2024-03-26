import LoginRequest from "dto/LoginRequest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userRepository from "../repositories/UserRepository";

class AuthService {
  async login(loginRequest: LoginRequest) {
    const { username, password } = loginRequest;
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      throw new Error("Authentication failed");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Authentication failed");
    }
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }
}

export default new AuthService();
