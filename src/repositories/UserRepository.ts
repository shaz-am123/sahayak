import User from "../domain/User";
import UserModel from "../models/User";

class UserRepository {
  async createUser(
    name: string,
    username: string,
    password: string
  ): Promise<User> {
    try {
      const user = new UserModel({ name, username, password });
      await user.save();
      return new User(user._id, user.name, user.username, user.password);
    } catch (error) {
      throw new Error("Failed to register user");
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    try {
      const user = await UserModel.findOne({ username });
      return new User(user._id, user.name, user.username, user.password);
    } catch (error) {
      throw new Error("User with username " + username + " does not exist");
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
