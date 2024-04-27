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
      deleteExpenseCategory: jest.fn(),
      updateExpenseCategory: jest.fn(),
      checkCategoryUniqueness: jest.fn(),
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
      expenseCount: 0,
    };

    categoryServiceMock.createCategory.mockResolvedValue(expectedResponse);

    const httpResponse = await categoryController.createCategory(
      userId,
      createCategoryRequest,
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
      mockCreateCategoryRequest,
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
      mockCreateCategoryRequest,
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
      expectedResponse,
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
      expenseCount: 0,
    });

    categoryServiceMock.getExpenseCategoryById.mockResolvedValue(
      expectedResponse,
    );

    const httpResponse = await categoryController.getExpenseCategoryById(
      userId,
      expenseCategoryId,
    );

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(200);
  });

  it("should handle any error that occurs while getting an expense category of an user using id", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const mockError = new Error("Internal Server Error");

    categoryServiceMock.getExpenseCategoryById.mockRejectedValue(mockError);

    const httpResponse = await categoryController.getExpenseCategoryById(
      userId,
      expenseCategoryId,
    );

    expect(httpResponse.body).toEqual({ error: mockError.message });
    expect(httpResponse.statusCode).toBe(500);
  });

  it("should be able to delete expense of an user using expense-id", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";

    const expectedResponse = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food",
      description: "Zomato, Swiggy, Eatsure",
      expenseCount: 0,
    });

    categoryServiceMock.deleteExpenseCategory.mockResolvedValue(
      expectedResponse,
    );

    const httpResponse = await categoryController.deleteExpenseCategory(
      userId,
      expenseCategoryId,
    );

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(200);
    expect(categoryServiceMock.deleteExpenseCategory).toHaveBeenCalledWith(
      userId,
      expenseCategoryId,
    );
  });

  it("should handle any error that occurs while deleting expense of an user using expense-id", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const mockError = new Error("Internal Server Error");

    categoryServiceMock.deleteExpenseCategory.mockRejectedValue(mockError);

    const httpResponse = await categoryController.deleteExpenseCategory(
      userId,
      expenseCategoryId,
    );

    expect(categoryServiceMock.deleteExpenseCategory).toHaveBeenCalledWith(
      userId,
      expenseCategoryId,
    );
    expect(httpResponse.body).toEqual({ error: mockError.message });
    expect(httpResponse.statusCode).toBe(500);
  });

  it("should be able to update an expense-category of an user", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";

    const expectedResponse = new ExpenseCategoryResponse({
      id: expenseCategoryId,
      userId: userId,
      name: "Food Order",
      description: "Zomato, Swiggy, Eatsure",
      expenseCount: 1,
    });

    categoryServiceMock.updateExpenseCategory.mockResolvedValue(
      expectedResponse,
    );

    const httpResponse = await categoryController.updateExpenseCategory(
      userId,
      expenseCategoryId,
      {
        name: "Food Order",
        expenseCount: 1,
      },
    );

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(200);
    expect(categoryServiceMock.updateExpenseCategory).toHaveBeenCalledWith(
      userId,
      expenseCategoryId,
      {
        name: "Food Order",
        expenseCount: 1,
      },
    );
  });

  it("should handle any error that occurs while updating expense-category of an user", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const mockError = new Error("Internal Server Error");

    categoryServiceMock.updateExpenseCategory.mockRejectedValue(mockError);

    const httpResponse = await categoryController.updateExpenseCategory(
      userId,
      expenseCategoryId,
      {},
    );

    expect(httpResponse.body).toEqual({ error: mockError.message });
    expect(httpResponse.statusCode).toBe(500);
  });

  it("should be able to check whether an expense-category is unique for a user or not", async () => {
    const expenseCategoryName = "Travel";
    const userId = "A001";

    const expectedResponse = {
      isUnique: true,
    };
    categoryServiceMock.checkCategoryUniqueness.mockResolvedValue(
      expectedResponse,
    );

    const httpResponse = await categoryController.checkCategoryUniquesness(
      userId,
      expenseCategoryName,
    );

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(200);
  });

  it("should be able to handle any error that occurs while checking the uniqueness of an expense-category", async () => {
    const expenseCategoryName = "Travel";
    const userId = "A001";
    const serverError = new Error("Internal Server Error");
    categoryServiceMock.checkCategoryUniqueness.mockRejectedValue(serverError);

    const httpResponse = await categoryController.checkCategoryUniquesness(
      userId,
      expenseCategoryName,
    );

    expect(httpResponse.body).toEqual({ error: serverError.message });
    expect(httpResponse.statusCode).toBe(500);
  });
});
