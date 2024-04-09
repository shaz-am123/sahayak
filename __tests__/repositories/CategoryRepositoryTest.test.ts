import mongoose from "mongoose";
import { DatabaseConfiguration } from "../../src/db";
import ExpenseCategory from "../../src/domain/ExpenseCategory";
import ExpenseCategoryModel from "../../src/models/ExpenseCategoryModel";
import { CategoryRepository } from "../../src/repositories/CategoryRepository";

describe("Category Repository Tests", () => {
  const userId = new mongoose.Types.ObjectId("660a9ca3cdaf2bd4e9f86c2c");
  let databaseConfiguration: DatabaseConfiguration;
  const categoryRepository = CategoryRepository.getInstance();
  var expenseCategoryId: string;

  afterAll(async () => {
    await databaseConfiguration.destructor();
    mongoose.connection.db.dropDatabase();
  });

  beforeEach(async () => {
    databaseConfiguration = await DatabaseConfiguration.getInstance(
      process.env.TESTING_DB_URL,
    );
    const categoryEntity = new ExpenseCategoryModel({
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
      userId: userId,
    });
    await categoryEntity.save();

    expenseCategoryId = categoryEntity.id;
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
    expect({ ...actualResponse, id: "ignore" }).toEqual({
      ...category,
      id: "ignore",
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

  it("should be able to get all the expense categories of an user", async () => {
    const expectedResponse: ExpenseCategory[] = [
      {
        id: null,
        userId: userId.toString(),
        name: "Food",
        description: "Zomato, Swiggy, Eatsure",
      },
    ];

    const actualResponse = await categoryRepository.getExpenseCategories(
      userId.toString(),
    );
    expect(actualResponse.length).toEqual(expectedResponse.length);
    actualResponse.forEach((category, index) => {
      expect({ ...category, id: "ignore" }).toEqual({
        ...expectedResponse[index],
        id: "ignore",
      });
    });
  });
  it("should handle any error that occurs while getting expense categories of an user", async () => {
    const databaseError = new Error("Failed to find expense category");
    const findCategoryMock = jest
      .spyOn(ExpenseCategoryModel, "find")
      .mockImplementation(() => {
        throw databaseError;
      });

    try {
      await categoryRepository.getExpenseCategories(userId.toString());
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(databaseError.message);
    }

    findCategoryMock.mockRestore();
  });

  it("should be able to get an expenseCategory of an user using id", async () => {
    const expectedResponse = new ExpenseCategory({
      id: expenseCategoryId,
      userId: userId.toString(),
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
    });

    const actualResponse = await categoryRepository.getExpenseCategoryById(
      userId.toString(),
      expenseCategoryId,
    );

    expect(actualResponse).toEqual(expectedResponse);
  });
  it("should handle any error that occurs while getting an expense category of an user", async () => {
    try {
      await categoryRepository.getExpenseCategoryById(userId.toString(), "-1");
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Expense category not found for given user");
    }
  });
});
