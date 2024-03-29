import User from "../domain/User";
import UserModel from "../models/User";

export class AuthRepository {
  private static instance: AuthRepository;

  private constructor() {}

  public static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  async createUser(user: User): Promise<User> {
    const userEntity = new UserModel({
      name: user.name,
      username: user.username,
      hashedPassword: user.hashedPassword,
    });
    await userEntity.save();
    return new User(
      userEntity._id,
      userEntity.name,
      userEntity.username,
      userEntity.hashedPassword
    );
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }
    return new User(user._id, user.name, user.username, user.hashedPassword);
  }
}
