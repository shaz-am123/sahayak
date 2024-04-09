import mongoose from "mongoose";
import { DatabaseConfiguration } from "../../src/db";
import Expense from "../../src/domain/Expense";
import ExpenseModel from "../../src/models/ExpenseModel";
import { ExpenseRepository } from "../../src/repositories/ExpenseRepository";
import Currency from "../../src/enums/Currency";

describe("Expense Repository Tests", () => {
  const userId = new mongoose.Types.ObjectId("660a9ca3cdaf2bd4e9f86c2c");
  let databaseConfiguration: DatabaseConfiguration;
  const expenseRepository = ExpenseRepository.getInstance();
  var expenseId: string;
  const expenseCategoryId = "1";

  afterAll(async () => {
    await databaseConfiguration.destructor();
    mongoose.connection.db.dropDatabase();
  });

  beforeEach(async () => {
    databaseConfiguration = await DatabaseConfiguration.getInstance(
      process.env.TESTING_DB_URL
    );
    const expenseEntity = new ExpenseModel({
      userId: userId,
      amount: 100,
      currency: "INR",
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    await expenseEntity.save();
    expenseId = expenseEntity.id;
  });

  afterEach(async () => {
    await ExpenseModel.deleteMany({});
  });

  it("should be able to create a new expense", async () => {
    const expense = new Expense({
      id: null,
      userId: userId.toString(),
      amount: 500,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const actualResponse = await expenseRepository.createExpense(expense);
    expect({ ...actualResponse, id: "ignore" }).toEqual({
      ...expense,
      id: "ignore",
    });
  });

  it("should be able to handle errors while creating a new expense", async () => {
    const userId = new mongoose.Types.ObjectId();
    const expense = new Expense({
      id: null,
      userId: userId.toString(),
      amount: 500,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const databaseError = new Error("Database error");
    const saveExpenseMock = jest
      .spyOn(ExpenseModel.prototype, "save")
      .mockImplementation(() => {
        throw databaseError;
      });

    try {
      await expenseRepository.createExpense(expense);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(databaseError.message);
    }
    saveExpenseMock.mockRestore();
  });

  it("should be able to get all the expenses of an user", async () => {
    const expectedResponse: Expense[] = [
      {
        id: expenseId,
        userId: userId.toString(),
        amount: 100,
        currency: Currency["INR" as keyof typeof Currency],
        expenseCategoryId: expenseCategoryId,
        description: "",
        date: new Date("2024-02-25"),
      },
    ];

    const actualResponse = await expenseRepository.getExpenses(
      userId.toString()
    );
    expect(actualResponse.length).toEqual(expectedResponse.length);
    actualResponse.forEach((expense, index) => {
      expect({ ...expense, id: "ignore" }).toEqual({
        ...expectedResponse[index],
        id: "ignore",
      });
    });
  });

  it("should handle any error that occurs while getting expenses of an user", async () => {
    const databaseError = new Error("Failed to find exepense expense");
    const findExpenseMock = jest
      .spyOn(ExpenseModel, "find")
      .mockImplementation(() => {
        throw databaseError;
      });

    try {
      await expenseRepository.getExpenses(userId.toString());
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(databaseError.message);
    }

    findExpenseMock.mockRestore();
  });

  it("should be able to get an expense of an user using expense-id", async () => {
    const expectedResponse = new Expense({
      id: expenseId,
      userId: userId.toString(),
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const actualResponse = await expenseRepository.getExpenseById(
      userId.toString(),
      expenseId
    );

    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should handle any error that occurs while getting an expense category of an user", async () => {
    try {
      await expenseRepository.getExpenseById(
        userId.toString(),
        "-1"
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Expense not found for given user");
    }
  });
});
