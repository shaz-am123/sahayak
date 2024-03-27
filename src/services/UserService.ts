import userRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import RegistrationRequest from "../dto/RegistrationRequest";
import RegistrationResponse from "../dto/RegistrationResponse";
import User from "../domain/User";

class UserService {
  async registerUser(registrationRequest: RegistrationRequest): Promise<RegistrationResponse> {
    const hashedPassword = await bcrypt.hash(registrationRequest.password, 10);
    const user = new User(null, registrationRequest.name, registrationRequest.username, hashedPassword)
    const registeredUser =  await userRepository.createUser(user);
    return new RegistrationResponse(registeredUser.id!, registeredUser.name, registeredUser.username)
  }
}

const userService = new UserService();
export default userService;
