import mongoose from "mongoose";
import User from "../domain/User";
import UserModel from "../models/UserModel";

export class AuthRepository {
  private static instance: AuthRepository;

  public static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  async registerUser(user: User): Promise<User> {
    const userEntity = new UserModel({ ...user });
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
      throw new Error("User not found, invalid username");
    }
    return new User({
      id: userEntity._id.toString(),
      name: userEntity.name,
      emailAddress: userEntity.emailAddress,
      username: userEntity.username,
      hashedPassword: userEntity.hashedPassword,
    });
  }

  async getUserById(userId: string): Promise<User> {
    const id = new mongoose.Types.ObjectId(userId);
    const userEntity = await UserModel.findOne({ _id: id });
    if (!userEntity) {
      throw new Error("User not found, invalid userId");
    }
    return new User({
      id: userEntity._id.toString(),
      name: userEntity.name,
      emailAddress: userEntity.emailAddress,
      username: userEntity.username,
      hashedPassword: userEntity.hashedPassword,
    });
  }

  async getUsers(): Promise<User[]> {
    const userEntities = await UserModel.find();

    return userEntities.map((userEntity) => {
      return new User({
        id: userEntity._id.toString(),
        name: userEntity.name,
        emailAddress: userEntity.emailAddress,
        username: userEntity.username,
        hashedPassword: userEntity.hashedPassword,
      });
    });
  }
}
