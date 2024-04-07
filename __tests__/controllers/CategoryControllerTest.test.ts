import ExpenseCategoryRequest from "../../src/dto/ExpenseCategoryRequest";
import ExpenseCategoryResponse from "../../src/dto/ExpenseCategoryResponse";
import MultipleExpenseCategoriesResponse from "../../src/dto/MultipleExpenseCategoriesResponse";
import { CustomValidationError } from "../../src/errors/CustomValidationError";
import { CategoryController } from "./../../src/controllers/CategoryController";
import { CategoryService } from "./../../src/services/CategoryService";

jest.mock("../../src/services/CategoryService", () => ({
  CategoryService: {
    getInstance: jest.fn(() => ({
      createCategory: jest.fn(),
      getExpenseCategories: jest.fn(),
      getExpenseCategoryById: jest.fn(),
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
    const createCategoryRequest = new ExpenseCategoryRequest({
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
    });
    const expectedResponse: ExpenseCategoryResponse = {
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

  it("should handle validation errors when an user tries to add a category", async () => {
    const userId = "A001";
    const mockCreateCategoryRequest = new ExpenseCategoryRequest({
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
          minLength: "Expense-category name must be at least 2 characters long",
          isNotEmpty: "Expense-category name is required",
        },
      },
    ]);

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
    const mockCreateCategoryRequest = new ExpenseCategoryRequest({
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

  it("should get all the expense categories of an user", async () => {
    const userId = "A001";
    const expectedResponse = new MultipleExpenseCategoriesResponse({
      expenseCategories: [],
      totalRecords: 0,
    });

    categoryServiceMock.getExpenseCategories.mockResolvedValue(
      expectedResponse
    );

    const httpResponse = await categoryController.getExpenseCategories(userId);

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(200);
  });

  it("should handle any error that occurs while getting expense categories of an user", async () => {
    const userId = "A001";
    const mockError = new Error("Internal Server Error");

    categoryServiceMock.getExpenseCategories.mockRejectedValue(mockError);

    const httpResponse = await categoryController.getExpenseCategories(userId);

    expect(httpResponse.body).toEqual({ error: mockError.message });
    expect(httpResponse.statusCode).toBe(500);
  });

  it("should be able to find an expense category of an user using id", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const expectedResponse = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
    });

    categoryServiceMock.getExpenseCategoryById.mockResolvedValue(
      expectedResponse
    );

    const httpResponse = await categoryController.getExpenseCategoriesById(
      userId,
      expenseCategoryId
    );

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(200);
  });

  it("should handle any error that occurs while getting an expense category of an user using id", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const mockError = new Error("Internal Server Error");

    categoryServiceMock.getExpenseCategoryById.mockRejectedValue(mockError);

    const httpResponse = await categoryController.getExpenseCategoriesById(
      userId,
      expenseCategoryId
    );

    expect(httpResponse.body).toEqual({ error: mockError.message });
    expect(httpResponse.statusCode).toBe(500);
  });
});
