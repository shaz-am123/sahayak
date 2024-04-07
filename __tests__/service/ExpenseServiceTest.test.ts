import Expense from "../../src/domain/Expense";
import ExpenseCategoryResponse from "../../src/dto/ExpenseCategoryResponse";
import ExpenseRequest from "../../src/dto/ExpenseRequest";
import ExpenseResponse from "../../src/dto/ExpenseResponse";
import MultipleExpensesResponse from "../../src/dto/MultipleExpensesResponse";
import Currency from "../../src/enums/Currency";
import { ExpenseRepository } from "../../src/repositories/ExpenseRepository";
import { CategoryService } from "../../src/services/CategoryService";
import { ExpenseService } from "../../src/services/ExpenseService";

jest.mock("../../src/repositories/ExpenseRepository", () => ({
  ExpenseRepository: {
    getInstance: jest.fn(() => ({
      createExpense: jest.fn(),
      getExpenses: jest.fn(),
    })),
  },
}));

jest.mock("../../src/services/categoryService", () => ({
  CategoryService: {
    getInstance: jest.fn(() => ({
      getExpenseCategoryById: jest.fn(),
    })),
  },
}));

describe("Expense Service tests", () => {
  const categoryServiceMock =
    CategoryService.getInstance() as jest.Mocked<CategoryService>;

  const expenseRepositoryMock =
    ExpenseRepository.getInstance() as jest.Mocked<ExpenseRepository>;

  const expenseService = ExpenseService.getInstance(
    expenseRepositoryMock,
    categoryServiceMock
  );

  it("should be able to create an expense", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const createExpenseRequest = new ExpenseRequest({
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const mockCategoryResponse = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "",
    });

    const expectedCreateExpenseResponse = new ExpenseResponse({
      id: "1",
      userId: userId,
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategory: mockCategoryResponse,
      description: "",
      date: new Date("2024-02-25"),
    });

    const mockExpenseResponse = new Expense({
      id: "1",
      userId: userId,
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    categoryServiceMock.getExpenseCategoryById.mockResolvedValue(
      mockCategoryResponse
    );
    expenseRepositoryMock.createExpense.mockResolvedValue(mockExpenseResponse);
    const createExpenseResponse = await expenseService.createExpense(
      userId,
      createExpenseRequest
    );
    expect(createExpenseResponse).toEqual(expectedCreateExpenseResponse);
  });

  it("should handle errors during expense creation", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const createExpenseRequest = new ExpenseRequest({
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const serverError = new Error("Internal Server Error");
    expenseRepositoryMock.createExpense.mockRejectedValue(serverError);

    try {
      await expenseService.createExpense(userId, createExpenseRequest);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Internal Server Error");
    }
  });

  it("should be able to get all the expenses of an user", async () => {
    const userId = "A001";
    const mockCategories = [
      new ExpenseCategoryResponse({
        id: "1",
        userId: userId,
        name: "Food",
        description: "",
      }),
      new ExpenseCategoryResponse({
        id: "2",
        userId: userId,
        name: "Travel",
        description: "",
      }),
    ];

    const repositoryMockResponse = [
      new Expense({
        id: "1",
        userId: userId,
        amount: 100,
        currency: Currency["INR" as keyof typeof Currency],
        expenseCategoryId: "1",
        description: "",
        date: new Date("2024-02-25"),
      }),
      new Expense({
        id: "2",
        userId: userId,
        amount: 500,
        currency: Currency["INR" as keyof typeof Currency],
        expenseCategoryId: "2",
        description: "",
        date: new Date("2024-02-15"),
      }),
    ];

    const expectedResponse = new MultipleExpensesResponse({
      expenses: [
        new ExpenseResponse({
          id: "1",
          userId: userId,
          amount: 100,
          currency: Currency["INR" as keyof typeof Currency],
          expenseCategory: mockCategories[0],
          description: "",
          date: new Date("2024-02-25"),
        }),
        new ExpenseResponse({
          id: "2",
          userId: userId,
          amount: 500,
          currency: Currency["INR" as keyof typeof Currency],
          expenseCategory: mockCategories[1],
          description: "",
          date: new Date("2024-02-15"),
        }),
      ],
      totalRecords: 2,
    });

    categoryServiceMock.getExpenseCategoryById.mockImplementation(
      (userId: string, expenseCategoryId: string) => {
        if (expenseCategoryId === "1") {
          return Promise.resolve(mockCategories[0]);
        }
        return Promise.resolve(mockCategories[1]);
      }
    );

    expenseRepositoryMock.getExpenses.mockResolvedValue(repositoryMockResponse);
    const actualResponse = await expenseService.getExpenses(userId);
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should be able to handle any error that occurs while getting expenses of an user", async () => {
    const userId = "A001";
    const mockError = new Error("Internal Server Error");

    expenseRepositoryMock.getExpenses.mockRejectedValue(mockError);
    try {
      await expenseService.getExpenses(userId);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(mockError.message);
    }
  });
});
