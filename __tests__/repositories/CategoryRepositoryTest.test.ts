import mongoose from "mongoose";
import { DatabaseConfiguration } from "../../src/db";
import ExpenseCategory from "../../src/domain/ExpenseCategory";
import ExpenseCategoryModel from "../../src/models/ExpenseCategoryModel";
import { CategoryRepository } from "../../src/repositories/CategoryRepository";

describe("Category Repository Tests", () => {
  const userId = new mongoose.Types.ObjectId();
  let databaseConfiguration: DatabaseConfiguration;
  const categoryRepository = CategoryRepository.getInstance();

  afterAll(async () => await databaseConfiguration.destructor());

  beforeEach(async () => {
    databaseConfiguration = await DatabaseConfiguration.getInstance(
      process.env.TESTING_DB_URL
    );
    const categoryEntity = new ExpenseCategoryModel({
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
      userId: userId,
    });
    await categoryEntity.save();
  });

  afterEach(async () => {
    await ExpenseCategoryModel.deleteMany({});
  });

  it("should be able to create a new category", async () => {
    const category = new ExpenseCategory({
      id: null,
      name: "Entertainment",
      description: "Movies, Netflix, Amazon Prime",
      userId: userId.toString(),
    });

    const actualResponse = await categoryRepository.createCategory(category);
    expect({ ...category, id: "ignore", userId: "ignore" }).toEqual({
      ...actualResponse,
      id: "ignore",
      userId: "ignore",
    });
  });

  it("should be able to handle error while creating a new category with existing name for the same user", async () => {
    const category = new ExpenseCategory({
      id: null,
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
      userId: userId.toString(),
    });

    try {
      await categoryRepository.createCategory(category);
    } catch (error: any) {
      const errorMessage = `E11000 duplicate key error collection: testing_sahayak.expense-categories index: userId_1_name_1 dup key: { userId: ObjectId('${userId.toString()}'), name: \"Food\" }`;
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(errorMessage);
    }
  });

  it("should be able to handle other errors while creating a new category", async () => {
    const userId = new mongoose.Types.ObjectId();
    const category = new ExpenseCategory({
      id: null,
      name: "Entertainment",
      description: "Movies, Netflix, Amazon Prime",
      userId: userId.toString(),
    });
    const databaseError = new Error("Database error");
    const saveCategoryMock = jest
      .spyOn(ExpenseCategoryModel.prototype, "save")
      .mockImplementation(() => {
        throw databaseError;
      });

    try {
      await categoryRepository.createCategory(category);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(databaseError.message);
    }
    saveCategoryMock.mockRestore();
  });
});
