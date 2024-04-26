import { DatabaseConfiguration } from "./../../src/db";
import { AuthRepository } from "../../src/repositories/AuthRepository";
import User from "../../src/domain/User";
import UserModel from "../../src/models/UserModel";
import mongoose from "mongoose";
require("dotenv").config();

describe("Authentication Repository tests", () => {
  let databaseConfiguration: DatabaseConfiguration;
  const authRepository = AuthRepository.getInstance();

  afterAll(async () => {
    await databaseConfiguration.destructor();
    mongoose.connection.db.dropDatabase();
  });

  beforeEach(async () => {
    databaseConfiguration = await DatabaseConfiguration.getInstance(
      process.env.TESTING_DB_URL,
    );
    const userEntity = new UserModel({
      name: "Vikram",
      username: "vikram123",
      emailAddress: "vikram@gmail.com",
      hashedPassword: "mockHashedPassword",
    });
    await userEntity.save();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  it("should be able to create a new user", async () => {
    const user = new User({
      id: null,
      name: "Ram",
      emailAddress: "ram@gmail.com",
      username: "ram123",
      hashedPassword: "mockHashedPassword",
    });
    const actualResponse = await authRepository.registerUser(user);
    expect({ ...user, id: "ignore" }).toEqual({
      ...actualResponse,
      id: "ignore",
    });
  });

  it("should be able to handle errors while creating new user with existing user name", async () => {
    const user = new User({
      id: null,
      name: "vikram",
      emailAddress: "vikram@gmail.com",
      username: "vikram123",
      hashedPassword: "mockHashedPassword",
    });

    try {
      await authRepository.registerUser(user);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        'E11000 duplicate key error collection: testing_sahayak.users index: username_1 dup key: { username: "vikram123" }',
      );
    }
  });

  it("should be able to handle errors while creating new user with existing user name", async () => {
    const user = new User({
      id: null,
      name: "Shyam",
      emailAddress: "shyam@gmail.com",
      username: "shyam123",
      hashedPassword: "mockHashedPassword",
    });
    const databaseError = new Error("Database error");
    const saveUserMock = jest
      .spyOn(UserModel.prototype, "save")
      .mockImplementation(() => {
        throw databaseError;
      });

    try {
      await authRepository.registerUser(user);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(databaseError.message);
    }
    saveUserMock.mockRestore();
  });

  it("should be able to search for a user using their username", async () => {
    const expectedResponse = new User({
      id: "A001",
      name: "Vikram",
      emailAddress: "vikram@gmail.com",
      username: "vikram123",
      hashedPassword: "mockHashedPassword",
    });
    const actualResponse = await authRepository.getUserByUsername("vikram123");
    expect(expectedResponse).toEqual({ ...actualResponse, id: "A001" });
  });

  it("should be able to handle UserNotFound error while searching for a user using their username", async () => {
    try {
      await authRepository.getUserByUsername("shyam123");
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("User not found, invalid username");
    }
  });

  it("should be able to handle UserNotFound error while searching for a user using their userId", async () => {
    try {
      const mockUserId = "650b31881c5859dde1eda378";
      await authRepository.getUserById(mockUserId);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("User not found, invalid userId");
    }
  });

  it("should be able to handle other errors while searching for a user using their username", async () => {
    const databaseError = new Error("Failed to find user");
    const findUserMock = jest
      .spyOn(UserModel, "findOne")
      .mockImplementation(() => {
        throw databaseError;
      });

    try {
      await authRepository.getUserByUsername("vikram123");
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(databaseError.message);
    }

    findUserMock.mockRestore();
  });

  it("should be able to return all the users", async () => {
    const userEntity = new UserModel({
      name: "Shyam",
      username: "shyam123",
      emailAddress: "shyam@gmail.com",
      hashedPassword: "mockHashedPassword",
    });
    await userEntity.save();

    const expectedResponse = [
      new User({
        id: "A001",
        name: "Vikram",
        emailAddress: "vikram@gmail.com",
        username: "vikram123",
        hashedPassword: "mockHashedPassword",
      }),
      new User({
        id: "A002",
        name: "Shyam",
        username: "shyam123",
        emailAddress: "shyam@gmail.com",
        hashedPassword: "mockHashedPassword",
      }),
    ];
    const actualResponse = await authRepository.getUsers();
    expectedResponse.map((user, index) => {
      expect({ ...actualResponse[index], id: user.id }).toEqual(user);
    });
  });
});
