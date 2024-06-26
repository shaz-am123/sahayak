import Expense from "../../src/domain/Expense";
import ExpenseCategoryResponse from "../../src/dto/ExpenseCategoryResponse";
import ExpenseRequest from "../../src/dto/ExpenseRequest";
import ExpenseResponse from "../../src/dto/ExpenseResponse";
import MultipleExpenseCategoriesResponse from "../../src/dto/MultipleExpenseCategoriesResponse";
import MultipleExpensesResponse from "../../src/dto/MultipleExpensesResponse";
import { ExpenseQueryParams } from "../../src/queryParams/ExpenseQueryParams";
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
      updateExpense: jest.fn(),
    })),
  },
}));

jest.mock("../../src/services/CategoryService", () => ({
  CategoryService: {
    getInstance: jest.fn(() => ({
      getExpenseCategoryById: jest.fn(),
      getExpenseCategories: jest.fn(),
      updateExpenseCategory: jest.fn(),
      getExpenseCount: jest.fn(),
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
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
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
      expenseCategory: mockUpdateCategoryResponse,
      description: "",
      date: new Date("2024-02-25"),
    });

    const mockExpenseResponse = new Expense({
      id: expenseId,
      userId: userId,
      amount: 100,
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    categoryServiceMock.getExpenseCount.mockResolvedValueOnce(0);

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
    expect(categoryServiceMock.getExpenseCount).toHaveBeenCalledWith(
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
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const expenseCategoryNotFoundError = new Error(
      "The expense category was not found for the user",
    );
    categoryServiceMock.getExpenseCount.mockRejectedValue(
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
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    categoryServiceMock.getExpenseCount.mockResolvedValue(0);
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
        expenseCategoryId: "1",
        description: "",
        date: new Date("2024-02-25"),
      }),
      new Expense({
        id: "2",
        userId: userId,
        amount: 500,
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
          expenseCategory: mockCategories[0],
          description: "",
          date: new Date("2024-02-25"),
        }),
        new ExpenseResponse({
          id: "2",
          userId: userId,
          amount: 500,
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
    const expenseQueryParams: ExpenseQueryParams = {
      startDate: null,
      endDate: null,
      expenseCategories: null,
    };
    const actualResponse = await expenseService.getExpenses(
      userId,
      expenseQueryParams,
    );
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should be able to get filtered expenses of an user based on query params", async () => {
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
        expenseCategoryId: "1",
        description: "",
        date: new Date("2024-02-25"),
      }),
      new Expense({
        id: "2",
        userId: userId,
        amount: 120,
        expenseCategoryId: "1",
        description: "",
        date: new Date("2024-02-26"),
      }),
      new Expense({
        id: "3",
        userId: userId,
        amount: 500,
        expenseCategoryId: "2",
        description: "",
        date: new Date("2024-02-15"),
      }),
    ];

    var expectedResponse = new MultipleExpensesResponse({
      expenses: [
        new ExpenseResponse({
          id: "3",
          userId: userId,
          amount: 500,
          expenseCategory: mockCategories[1],
          description: "",
          date: new Date("2024-02-15"),
        }),
      ],
      totalRecords: 1,
    });

    categoryServiceMock.getExpenseCategories.mockResolvedValue(
      new MultipleExpenseCategoriesResponse({
        expenseCategories: mockCategories,
        totalRecords: 2,
      }),
    );

    expenseRepositoryMock.getExpenses.mockResolvedValue(repositoryMockResponse);

    var expenseQueryParams: ExpenseQueryParams = {
      startDate: null,
      endDate: null,
      expenseCategories: ["2"],
    };
    var actualResponse = await expenseService.getExpenses(
      userId,
      expenseQueryParams,
    );
    expect(actualResponse).toEqual(expectedResponse);

    var expectedResponse = new MultipleExpensesResponse({
      expenses: [
        new ExpenseResponse({
          id: "1",
          userId: userId,
          amount: 100,
          expenseCategory: mockCategories[0],
          description: "",
          date: new Date("2024-02-25"),
        }),
        new ExpenseResponse({
          id: "2",
          userId: userId,
          amount: 120,
          expenseCategory: mockCategories[0],
          description: "",
          date: new Date("2024-02-26"),
        }),
      ],
      totalRecords: 2,
    });

    var expenseQueryParams: ExpenseQueryParams = {
      startDate: new Date("2024-02-20"),
      endDate: new Date("2024-02-30"),
      expenseCategories: ["1"],
    };
    var actualResponse = await expenseService.getExpenses(
      userId,
      expenseQueryParams,
    );
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should be able to handle any error that occurs while getting expenses of an user", async () => {
    const userId = "A001";
    const mockError = new Error("Internal Server Error");
    const expenseQueryParams: ExpenseQueryParams = {
      startDate: null,
      endDate: null,
      expenseCategories: null,
    };

    expenseRepositoryMock.getExpenses.mockRejectedValue(mockError);
    try {
      await expenseService.getExpenses(userId, expenseQueryParams);
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
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const expectedResponse = new ExpenseResponse({
      id: "1",
      userId: userId,
      amount: 100,
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
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });

    const expectedResponse = new ExpenseResponse({
      id: "1",
      userId: userId,
      amount: 100,
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

  it("should be able to update an expense of an user using id", async () => {
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
      amount: 200,
      expenseCategoryId: expenseCategoryId,
      description: "Zomato dinner order",
      date: new Date("2024-02-25"),
    });

    const expectedResponse = new ExpenseResponse({
      ...repositoryMockResponse,
      id: expenseId,
      expenseCategory: mockExpenseCategory,
    });

    expenseRepositoryMock.updateExpense.mockResolvedValue();
    expenseRepositoryMock.getExpenseById.mockResolvedValue(
      repositoryMockResponse,
    );

    const actualResponse = await expenseService.updateExpense(
      userId,
      expenseId,
      {
        amount: 200,
        description: "Zomato dinner order",
      },
    );
    expect(actualResponse).toEqual(expectedResponse);
    expect(expenseRepositoryMock.updateExpense).toHaveBeenCalledWith(
      userId,
      expenseId,
      {
        amount: 200,
        description: "Zomato dinner order",
      },
    );
    expect(expenseRepositoryMock.getExpenseById).toHaveBeenCalledWith(
      userId,
      expenseId,
    );
  });

  it("should be able to handle any error that occurs while updating an expense category of an user", async () => {
    const userId = "A001";
    const expenseId = "1";
    const expenseCategoryId = "1";

    const mockError = new Error("Internal Server Error");

    expenseRepositoryMock.updateExpense.mockRejectedValue(mockError);
    try {
      await expenseService.updateExpense(userId, expenseId, {
        amount: 200,
        description: "Zomato dinner order",
      });

      expect(expenseRepositoryMock.updateExpense).toHaveBeenCalledWith(
        userId,
        expenseId,
        { expenseCount: 1 },
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(mockError.message);
    }
  });
});
