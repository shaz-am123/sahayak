import User from "dto/User";
import userRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";


const registerUser = async (user: User) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  return await userRepository.createUser(user.name, user.username, hashedPassword)
};

export default { registerUser };
