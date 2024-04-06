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
    });

    const mockCategoryResponse = new ExpenseCategory({
      id: "1",
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
      userId: userId,
    });

    categoryRepositoryMock.createCategory.mockResolvedValue(
      mockCategoryResponse
    );
    const createCategoryResponse = await categoryService.createCategory(
      userId,
      createCategoryRequest
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
      repositoryMockResponse
    );
    const actualResponse = await categoryService.getExpenseCategories(userId);
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should be able to handle any error that occurs while getting categories of an user", async () => {
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
    });
    const expectedResponse = new ExpenseCategoryResponse({
      ...repositoryMockResponse,
      id: expenseCategoryId,
    });

    categoryRepositoryMock.getExpenseCategoryById.mockResolvedValue(
      repositoryMockResponse
    );
    const actualResponse = await categoryService.getExpenseCategoryById(
      userId,
      expenseCategoryId
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
});
