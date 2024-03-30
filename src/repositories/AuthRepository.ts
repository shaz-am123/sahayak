import User from "../domain/User";
import UserModel from "../models/UserModel";
import { DatabaseConnection } from "../db";

export class AuthRepository {
  private static instance: AuthRepository;

  private constructor(databaseConnection: DatabaseConnection) {
    databaseConnection.connect();
  }

  public static getInstance(databaseConnection: DatabaseConnection = DatabaseConnection.getInstance()): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository(databaseConnection);
    }
    return AuthRepository.instance;
  }

  async registerUser(user: User): Promise<User> {
    const userEntity = new UserModel({
      name: user.name,
      username: user.username,
      emailAddress: user.emailAddress,
      hashedPassword: user.hashedPassword,
    });
    await userEntity.save();
    return new User(
      userEntity._id,
      userEntity.name,
      userEntity.emailAddress,
      userEntity.username,
      userEntity.hashedPassword
    );
  }

  async getUserByUsername(username: string): Promise<User> {
    const userEntity = await UserModel.findOne({ username });
    if (!userEntity) {
      throw new Error("User not found");
    }
    return new User(userEntity._id, userEntity.name,  userEntity.emailAddress, userEntity.username, userEntity.hashedPassword);
  }
}
