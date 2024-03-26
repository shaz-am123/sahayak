import userRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import RegistrationRequest from "../dto/RegistrationRequest";
import RegistrationResponse from "../dto/RegistrationResponse";

class UserService {
  async registerUser(user: RegistrationRequest): Promise<RegistrationResponse> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const registeredUser =  await userRepository.createUser(
      user.name,
      user.username,
      hashedPassword
    );
    return new RegistrationResponse(registeredUser.id, registeredUser.name, registeredUser.username)
  }
}

export default new UserService();
