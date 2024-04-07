import ExpenseCategoryResponse from "../../src/dto/ExpenseCategoryResponse";
import ExpenseRequest from "../../src/dto/ExpenseRequest";
import ExpenseResponse from "../../src/dto/ExpenseResponse";
import MultipleExpensesResponse from "../../src/dto/MultipleExpensesResponse";
import Currency from "../../src/enums/Currency";
import { CustomValidationError } from "../../src/errors/CustomValidationError";
import { ExpenseController } from "./../../src/controllers/ExpenseController";
import { ExpenseService } from "./../../src/services/ExpenseService";

jest.mock("../../src/services/ExpenseService", () => ({
  ExpenseService: {
    getInstance: jest.fn(() => ({
      createExpense: jest.fn(),
      getExpenses: jest.fn(),
    })),
  },
}));

describe("Expense Controller tests", () => {
  const expenseServiceMock =
    ExpenseService.getInstance() as jest.Mocked<ExpenseService>;
  const expenseController = ExpenseController.getInstance(expenseServiceMock);

  it("should allow users to add an expense", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const createExpenseRequest = new ExpenseRequest({
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
      expenseCategory: new ExpenseCategoryResponse({
        id: expenseCategoryId,
        userId: userId,
        name: "Food",
        description: "",
      }),
      description: "",
      date: new Date("2024-02-25"),
    });

    expenseServiceMock.createExpense.mockResolvedValue(expectedResponse);

    const httpResponse = await expenseController.createExpense(
      userId,
      createExpenseRequest
    );

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(201);
  });

  it("should handle validation errors when an user tries to add a expense", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const mockCreateExpenseRequest = new ExpenseRequest({
      amount: -5,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });
    const validationError = new CustomValidationError("Validation error", [
      {
        target: {
          amount: -5,
          currency: "INR",
          expenseCategoryId: expenseCategoryId,
          description: "",
          date: new Date("2024-02-25"),
        },
        value: -5,
        property: "amount",
        children: [],
        constraints: {
          isPositive: "Amount must be a positive number",
        },
      },
    ]);

    const httpResponse = await expenseController.createExpense(
      userId,
      mockCreateExpenseRequest
    );

    expect(httpResponse.body).toEqual({
      error: validationError.validationErrors,
    });
    expect(httpResponse.statusCode).toBe(400);
  });

  it("should handle other errors when an user tries to add an expense", async () => {
    const userId = "A001";
    const expenseCategoryId = "1";
    const mockCreateExpenseRequest = new ExpenseRequest({
      amount: 100,
      currency: Currency["INR" as keyof typeof Currency],
      expenseCategoryId: expenseCategoryId,
      description: "",
      date: new Date("2024-02-25"),
    });
    const errorMessage = "Internal Server Error";
    const error = new Error(errorMessage);

    expenseServiceMock.createExpense.mockRejectedValue(error);

    const httpResponse = await expenseController.createExpense(
      userId,
      mockCreateExpenseRequest
    );

    expect(httpResponse.body).toEqual({ error: errorMessage });
    expect(httpResponse.statusCode).toBe(500);
  });

  it("should get all the expenses of an user", async () => {
    const userId = "A001";
    const expectedResponse = new MultipleExpensesResponse({
      expenses: [],
      totalRecords: 0,
    });

    expenseServiceMock.getExpenses.mockResolvedValue(expectedResponse);

    const httpResponse = await expenseController.getExpenses(userId);

    expect(httpResponse.body).toEqual(expectedResponse);
    expect(httpResponse.statusCode).toBe(200);
  });

  it("should handle any error that occurs while getting expenses of an user", async () => {
    const userId = "A001";
    const mockError = new Error("Internal Server Error");

    expenseServiceMock.getExpenses.mockRejectedValue(mockError);

    const httpResponse = await expenseController.getExpenses(userId);

    expect(httpResponse.body).toEqual({ error: mockError.message });
    expect(httpResponse.statusCode).toBe(500);
  });
});
