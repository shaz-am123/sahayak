import User from "dto/User";
import userRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";

class UserService {
  async registerUser(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return await userRepository.createUser(
      user.name,
      user.username,
      hashedPassword
    );
  }
}

export default new UserService();
