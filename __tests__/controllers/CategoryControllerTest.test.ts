import CreateCategoryRequest from "../../src/dto/CreateCategoryRequest";
import CreateCategoryResponse from "../../src/dto/CreateCategoryResponse";
import { CustomValidationError } from "../../src/errors/CustomValidationError";
import { CategoryController } from "./../../src/controllers/CategoryController";
import { CategoryService } from "./../../src/services/CategoryService";

jest.mock("../../src/services/CategoryService", () => ({
  CategoryService: {
    getInstance: jest.fn(() => ({
      createCategory: jest.fn(),
    })),
  },
}));

describe("Category Controller tests", () => {
  const categoryServiceMock =
    CategoryService.getInstance() as jest.Mocked<CategoryService>;
  const categoryController =
    CategoryController.getInstance(categoryServiceMock);

  it("should allow users to add a category", async () => {
    const userId = "A001";
    const createCategoryRequest = new CreateCategoryRequest({
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
    });
    const expectedResponse: CreateCategoryResponse = {
      ...createCategoryRequest,
      id: "1",
      userId: userId,
    };

    categoryServiceMock.createCategory.mockResolvedValue(expectedResponse);

    const httpResponse = await categoryController.createCategory(
      userId,
      createCategoryRequest
    );

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(201);
  });

  it("should handle validation errors when a user tries to add a category", async () => {
    const userId = "A001";
    const mockCreateCategoryRequest = new CreateCategoryRequest({
      name: "",
      description: "Zomato, Swiggy, Eatsure",
    });
    const validationError = new CustomValidationError("Validation error", [
      {
        target: {
          name: "",
          description: "Zomato, Swiggy, Eatsure",
        },
        value: "",
        property: "name",
        children: [],
        constraints: {
          minLength: "Category name must be at least 2 characters long",
          isNotEmpty: "Category name is required",
        },
      },
    ]);

    categoryServiceMock.createCategory.mockRejectedValue(validationError);

    const httpResponse = await categoryController.createCategory(
      userId,
      mockCreateCategoryRequest
    );

    expect(httpResponse.body).toEqual({
      error: validationError.validationErrors,
    });
    expect(httpResponse.statusCode).toBe(400);
  });

  it("should handle other errors when an user tries to add a category", async () => {
    const userId = "A001";
    const mockCreateCategoryRequest = new CreateCategoryRequest({
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
    });
    const errorMessage = "Internal Server Error";
    const error = new Error(errorMessage);

    categoryServiceMock.createCategory.mockRejectedValue(error);

    const httpResponse = await categoryController.createCategory(
      userId,
      mockCreateCategoryRequest
    );

    expect(httpResponse.body).toEqual({ error: errorMessage });
    expect(httpResponse.statusCode).toBe(500);
  });
});
