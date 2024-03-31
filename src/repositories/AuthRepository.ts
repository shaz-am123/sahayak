import User from "../domain/User";
import { DatabaseConnection } from "../db";
import UserModel from "../models/UserModel";

export class AuthRepository {
  private static instance: AuthRepository;
  private databaseConnection: DatabaseConnection;

  private constructor(databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
    this.databaseConnection.connect();
  }

  public async destructor() {
    await this.databaseConnection.disconnect();
  }

  public static getInstance(
    databaseConnection: DatabaseConnection = DatabaseConnection.getInstance()
  ): AuthRepository {
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
    return new User({
      id: userEntity._id.toString(),
      name: userEntity.name,
      emailAddress: userEntity.emailAddress,
      username: userEntity.username,
      hashedPassword: userEntity.hashedPassword,
    });
  }

  async getUserByUsername(username: string): Promise<User> {
    const userEntity = await UserModel.findOne({ username });
    if (!userEntity) {
      throw new Error("User not found");
    }
    return new User({
      id: userEntity._id.toString(),
      name: userEntity.name,
      emailAddress: userEntity.emailAddress,
      username: userEntity.username,
      hashedPassword: userEntity.hashedPassword,
    });
  }
}
