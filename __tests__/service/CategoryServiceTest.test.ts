import Category from "../../src/domain/Category";
import CreateCategoryRequest from "../../src/dto/CreateCategoryRequest";
import CreateCategoryResponse from "../../src/dto/CreateCategoryResponse";
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
    const createCategoryRequest = new CreateCategoryRequest({
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
    });
    const expectedCreateCategoryResponse = new CreateCategoryResponse({
      ...createCategoryRequest,
      id: "1",
      userId: userId,
    });

    const mockCategoryResponse = new Category({
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
    const categoryCreationRequest = new CreateCategoryRequest({
        name: "Food",
        description: "Zomato, Swiggy, Eatsure"
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
