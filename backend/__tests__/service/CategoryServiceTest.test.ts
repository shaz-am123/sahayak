import ExpenseCategory from "../../src/domain/ExpenseCategory";
import ExpenseCategoryRequest from "../../src/dto/ExpenseCategoryRequest";
import ExpenseCategoryResponse from "../../src/dto/ExpenseCategoryResponse";
import MultipleExpenseCategoriesResponse from "../../src/dto/MultipleExpenseCategoriesResponse";
import { CategoryRepository } from "../../src/repositories/CategoryRepository";
import { CategoryService } from "../../src/services/CategoryService";

jest.mock("../../src/repositories/CategoryRepository", () => ({
  CategoryRepository: {
    getInstance: jest.fn(() => ({
      createCategory: jest.fn(),
      getExpenseCategories: jest.fn(),
      getExpenseCategoryById: jest.fn(),
      updateExpenseCategory: jest.fn(),
      deleteExpenseCategory: jest.fn(),
    })),
  },
}));

describe("Category Service tests", () => {
  const categoryRepositoryMock =
    CategoryRepository.getInstance() as jest.Mocked<CategoryRepository>;
  const categoryService = CategoryService.getInstance(categoryRepositoryMock);

  it("should be able to create a category", async () => {
    const userId = "A001";
    const createCategoryRequest = new ExpenseCategoryRequest({
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
    });
    const expectedCreateCategoryResponse = new ExpenseCategoryResponse({
      ...createCategoryRequest,
      id: "1",
      userId: userId,
      expenseCount: 0,
    });

    const mockCategoryResponse = new ExpenseCategory({
      id: "1",
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
      userId: userId,
      expenseCount: 0,
    });

    categoryRepositoryMock.createCategory.mockResolvedValue(
      mockCategoryResponse,
    );
    const createCategoryResponse = await categoryService.createCategory(
      userId,
      createCategoryRequest,
    );
    expect(createCategoryResponse).toEqual(expectedCreateCategoryResponse);
  });

  it("should handle errors during category creation", async () => {
    const userId = "A001";
    const categoryCreationRequest = new ExpenseCategoryRequest({
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
    });

    const serverError = new Error("Internal Server Error");
    categoryRepositoryMock.createCategory.mockRejectedValue(serverError);

    try {
      await categoryService.createCategory(userId, categoryCreationRequest);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Internal Server Error");
    }
  });

  it("should be able to get all the categories of an user", async () => {
    const userId = "A001";
    const repositoryMockResponse = [] as ExpenseCategory[];
    const expectedResponse = new MultipleExpenseCategoriesResponse({
      expenseCategories: [],
      totalRecords: 0,
    });

    categoryRepositoryMock.getExpenseCategories.mockResolvedValue(
      repositoryMockResponse,
    );
    const actualResponse = await categoryService.getExpenseCategories(userId);
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should be able to handle any error that occurs while getting expense categories of an user", async () => {
    const userId = "A001";
    const mockError = new Error("Internal Server Error");

    categoryRepositoryMock.getExpenseCategories.mockRejectedValue(mockError);
    try {
      await categoryService.getExpenseCategories(userId);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(mockError.message);
    }
  });

  it("should be able to get an expense category of an user using id", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const repositoryMockResponse = new ExpenseCategory({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
      expenseCount: 0,
    });
    const expectedResponse = new ExpenseCategoryResponse({
      ...repositoryMockResponse,
      id: expenseCategoryId,
    });

    categoryRepositoryMock.getExpenseCategoryById.mockResolvedValue(
      repositoryMockResponse,
    );
    const actualResponse = await categoryService.getExpenseCategoryById(
      userId,
      expenseCategoryId,
    );
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should be able to handle any error that occurs while getting an expense category of an user", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const mockError = new Error("Internal Server Error");

    categoryRepositoryMock.getExpenseCategoryById.mockRejectedValue(mockError);
    try {
      await categoryService.getExpenseCategoryById(userId, expenseCategoryId);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(mockError.message);
    }
  });

  it("should be able to update an expense category of an user using id", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const repositoryMockResponse = new ExpenseCategory({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
      expenseCount: 0,
    });
    const expectedResponse = new ExpenseCategoryResponse({
      ...repositoryMockResponse,
      id: expenseCategoryId,
    });

    categoryRepositoryMock.updateExpenseCategory.mockResolvedValue(
      repositoryMockResponse,
    );
    const actualResponse = await categoryService.updateExpenseCategory(
      userId,
      expenseCategoryId,
      {
        expenseCount: 1,
      },
    );
    expect(actualResponse).toEqual(expectedResponse);
    expect(categoryRepositoryMock.updateExpenseCategory).toHaveBeenCalledWith(
      userId,
      expenseCategoryId,
      { expenseCount: 1 },
    );
  });

  it("should be able to handle any error that occurs while updating an expense category of an user", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const mockError = new Error("Internal Server Error");

    categoryRepositoryMock.updateExpenseCategory.mockRejectedValue(mockError);
    try {
      await categoryService.updateExpenseCategory(userId, expenseCategoryId, {
        expenseCount: 1,
      });

      expect(categoryRepositoryMock.updateExpenseCategory).toHaveBeenCalledWith(
        userId,
        expenseCategoryId,
        { expenseCount: 1 },
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(mockError.message);
    }
  });

  it("should be able to delete expense-category of an user using id", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";

    const expectedResponse = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "",
      expenseCount: 0,
    });

    categoryRepositoryMock.getExpenseCategoryById.mockResolvedValue(
      expectedResponse,
    );

    categoryRepositoryMock.deleteExpenseCategory.mockResolvedValue();

    const actualResponse = await categoryService.deleteExpenseCategory(
      userId,
      expenseCategoryId,
    );
    expect(actualResponse).toEqual(expectedResponse);
    expect(categoryRepositoryMock.getExpenseCategoryById).toHaveBeenCalledWith(
      userId,
      expenseCategoryId,
    );
    expect(categoryRepositoryMock.deleteExpenseCategory).toHaveBeenCalledWith(
      userId,
      expenseCategoryId,
    );
  });

  it("should handle error that occurs while deleting an expense-category which has associated expenses", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";

    const mockExpenseCategory = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "",
      expenseCount: 2,
    });

    categoryRepositoryMock.getExpenseCategoryById.mockResolvedValue(
      mockExpenseCategory,
    );

    try {
      await categoryService.deleteExpenseCategory(userId, expenseCategoryId);
      expect(
        categoryRepositoryMock.getExpenseCategoryById,
      ).toHaveBeenCalledWith(userId, expenseCategoryId);
      expect(
        categoryRepositoryMock.deleteExpenseCategory,
      ).toHaveBeenCalledTimes(0);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        "Expense category cannot be deleted. Associated expenses exist",
      );
    }
  });

  it("should handle any error that occurs while deleting an expense-category", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";

    const mockExpenseCategory = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "",
      expenseCount: 0,
    });

    const mockError = new Error("Internal Server Error");
    categoryRepositoryMock.getExpenseCategoryById.mockResolvedValue(
      mockExpenseCategory,
    );
    categoryRepositoryMock.deleteExpenseCategory.mockRejectedValue(mockError);

    try {
      await categoryService.deleteExpenseCategory(userId, expenseCategoryId);
      expect(
        categoryRepositoryMock.getExpenseCategoryById,
      ).toHaveBeenCalledWith(userId, expenseCategoryId);
      expect(categoryRepositoryMock.deleteExpenseCategory).toHaveBeenCalledWith(
        userId,
        expenseCategoryId,
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(mockError.message);
    }
  });

  it("should check for expense-category uniqueness for an user", async () => {
    const userId = "A001";
    const mockRepositoryResponse = [
      new ExpenseCategory({
        id: "1",
        userId: userId,
        name: "Travel",
        description: "",
        expenseCount: 1,
      }),
      new ExpenseCategory({
        id: "2",
        userId: userId,
        name: "Groceries",
        description: "",
        expenseCount: 1,
      }),
      new ExpenseCategory({
        id: "3",
        userId: userId,
        name: "Stationary",
        description: "",
        expenseCount: 2,
      }),
    ];

    categoryRepositoryMock.getExpenseCategories.mockResolvedValue(
      mockRepositoryResponse,
    );

    var actualResponse = await categoryService.checkCategoryUniqueness(
      userId,
      "Travel",
    );
    expect(actualResponse).toEqual({ isUnique: false });

    actualResponse = await categoryService.checkCategoryUniqueness(
      userId,
      "Shopping",
    );
    expect(actualResponse).toEqual({ isUnique: true });
  });

  it("should handle any error that occurs while getting users from repository", async () => {
    const userId = "A001";
    const dbError = new Error("Database Error");
    categoryRepositoryMock.getExpenseCategories.mockRejectedValue(dbError);
    try {
      await categoryService.checkCategoryUniqueness(userId, "Travel");
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Database Error");
    }
  });
});
