import User from "../models/User";

class UserRepository {
  async createUser(name: string, username: string, password: string) {
    try {
      const user = new User({ name, username, password });
      await user.save();
      return {
        name: name,
        username: username,
      };
    } catch (error) {
      throw new Error("Failed to register user");
    }
  }

  async getUserByUsername(username: string) {
    try {
      return await User.findOne({ username });
    } catch (error) {
      throw new Error("Failed to get user by username");
    }
  }
}

export default new UserRepository();
