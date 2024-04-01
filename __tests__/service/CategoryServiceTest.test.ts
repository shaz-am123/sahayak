import ExpenseCategory from "../../src/domain/ExpenseCategory";
import ExpenseCategoryRequest from "../../src/dto/ExpenseCategoryRequest";
import ExpenseCategoryResponse from "../../src/dto/ExpenseCategoryResponse";
import { CategoryRepository } from "../../src/repositories/CategoryRepository";
import { CategoryService } from "../../src/services/CategoryService";

jest.mock("../../src/repositories/CategoryRepository", () => ({
  CategoryRepository: {
    getInstance: jest.fn(() => ({
      createCategory: jest.fn(),
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
});
