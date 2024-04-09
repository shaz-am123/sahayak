import Expense from "../../src/domain/Expense";
import ExpenseCategoryResponse from "../../src/dto/ExpenseCategoryResponse";
import ExpenseRequest from "../../src/dto/ExpenseRequest";
import ExpenseResponse from "../../src/dto/ExpenseResponse";
import MultipleExpenseCategoriesResponse from "../../src/dto/MultipleExpenseCategoriesResponse";
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
      getExpenseById: jest.fn(),
      deleteExpense: jest.fn(),
    })),
  },
}));

jest.mock("../../src/services/CategoryService", () => ({
  CategoryService: {
    getInstance: jest.fn(() => ({
      getExpenseCategoryById: jest.fn(),
      getExpenseCategories: jest.fn(),
      updateExpenseCategory: jest.fn(),
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
    categoryServiceMock,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be able to create an expense", async () => {
    const userId = "A001";
    const expenseId = "1";
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
      expenseCount: 0,
    });

    const mockUpdateCategoryResponse = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "",
      expenseCount: 1,
    });

    const expectedCreateExpenseResponse = new ExpenseResponse({
      id: expenseId,
      userId: userId,
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategory: mockCategoryResponse,
      description: "",
      date: new Date("2024-02-25"),
    });

    const mockExpenseResponse = new Expense({
      id: expenseId,
      userId: userId,
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    categoryServiceMock.getExpenseCategoryById.mockResolvedValueOnce(
      mockCategoryResponse,
    );

    categoryServiceMock.updateExpenseCategory.mockResolvedValueOnce(
      mockUpdateCategoryResponse,
    );

    expenseRepositoryMock.createExpense.mockResolvedValueOnce(
      mockExpenseResponse,
    );
    const createExpenseResponse = await expenseService.createExpense(
      userId,
      createExpenseRequest,
    );
    expect(createExpenseResponse).toEqual(expectedCreateExpenseResponse);
    expect(categoryServiceMock.getExpenseCategoryById).toHaveBeenCalledWith(
      userId,
      expenseCategoryId,
    );
    expect(categoryServiceMock.updateExpenseCategory).toHaveBeenCalledWith(
      userId,
      expenseCategoryId,
      { expenseCount: 1 },
    );
    expect(expenseRepositoryMock.createExpense).toHaveBeenCalledWith({
      ...mockExpenseResponse,
      id: null,
    });
  });

  it("should handle incorrect expense category in expense creation request", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const createExpenseRequest = new ExpenseRequest({
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const expenseCategoryNotFoundError = new Error(
      "The expense category was not found for the user",
    );
    categoryServiceMock.getExpenseCategoryById.mockRejectedValue(
      expenseCategoryNotFoundError,
    );

    try {
      await expenseService.createExpense(userId, createExpenseRequest);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(expenseCategoryNotFoundError.message);
    }
  });

  it("should handle other errors during expense creation", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const mockExpenseCategory = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "",
      expenseCount: 0,
    });

    const createExpenseRequest = new ExpenseRequest({
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    categoryServiceMock.getExpenseCategoryById.mockResolvedValue(
      mockExpenseCategory,
    );
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
        expenseCount: 1,
      }),
      new ExpenseCategoryResponse({
        id: "2",
        userId: userId,
        name: "Travel",
        description: "",
        expenseCount: 1,
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

    categoryServiceMock.getExpenseCategories.mockResolvedValueOnce(
      new MultipleExpenseCategoriesResponse({
        expenseCategories: mockCategories,
        totalRecords: 2,
      }),
    );

    expenseRepositoryMock.getExpenses.mockResolvedValueOnce(
      repositoryMockResponse,
    );
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

  it("should be able to get an expense of an user using expense-id", async () => {
    const userId = "A001";
    const expenseId = "1";
    const expenseCategoryId = "1";

    const mockExpenseCategory = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "",
      expenseCount: 1,
    });

    const repositoryMockResponse = new Expense({
      id: expenseId,
      userId: userId,
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const expectedResponse = new ExpenseResponse({
      id: "1",
      userId: userId,
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategory: mockExpenseCategory,
      description: "",
      date: new Date("2024-02-25"),
    });

    categoryServiceMock.getExpenseCategoryById.mockResolvedValue(
      mockExpenseCategory,
    );
    expenseRepositoryMock.getExpenseById.mockResolvedValue(
      repositoryMockResponse,
    );
    const actualResponse = await expenseService.getExpenseById(
      userId,
      expenseCategoryId,
    );
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should handle any error that occurs in categoryService while getting expense by id", async () => {
    const userId = "A001";
    const expenseId = "1";

    const expenseCategoryServiceError = new Error("Cateogory Service Error");
    categoryServiceMock.getExpenseCategoryById.mockRejectedValue(
      expenseCategoryServiceError,
    );

    try {
      await expenseService.getExpenseById(userId, expenseId);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(expenseCategoryServiceError.message);
    }
  });

  it("should be able to handle any repository error that occurs while getting an expense by id", async () => {
    const userId = "A001";
    const expenseId = "1";
    const mockError = new Error("Internal Server Error");

    expenseRepositoryMock.getExpenseById.mockRejectedValue(mockError);
    try {
      await expenseService.getExpenseById(userId, expenseId);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(mockError.message);
    }
  });

  it("should be able to delete expense of an user using expense-id", async () => {
    const userId = "A001";
    const expenseId = "1";
    const expenseCategoryId = "1";

    const mockExpenseCategory = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "",
      expenseCount: 0,
    });

    const repositoryMockResponse = new Expense({
      id: expenseId,
      userId: userId,
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const expectedResponse = new ExpenseResponse({
      id: "1",
      userId: userId,
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategory: mockExpenseCategory,
      description: "",
      date: new Date("2024-02-25"),
    });

    categoryServiceMock.getExpenseCategoryById.mockResolvedValue({
      ...mockExpenseCategory,
      expenseCount: 1,
    });

    categoryServiceMock.updateExpenseCategory.mockResolvedValue(
      mockExpenseCategory,
    );

    expenseRepositoryMock.deleteExpense.mockResolvedValue(
      repositoryMockResponse,
    );

    const actualResponse = await expenseService.deleteExpense(
      userId,
      expenseId,
    );
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should handle any error that occurs while deleting an expense", async () => {
    const userId = "A001";
    const expenseId = "1";

    const mockError = new Error("Internal Server Error");
    expenseRepositoryMock.deleteExpense.mockRejectedValue(mockError);

    try {
      await expenseService.getExpenseById(userId, expenseId);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(mockError.message);
    }
  });
});
