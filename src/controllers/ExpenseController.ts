import ExpenseRequest from "../dto/ExpenseRequest";
import HttpResponse from "../dto/HttpResponse";
import validateRequest from "../dto/ValidateRequestDto";
import { CustomValidationError } from "../errors/CustomValidationError";
import { ExpenseService } from "../services/ExpenseService";

export class ExpenseController {
  private static instance: ExpenseController;
  private expenseService: ExpenseService;

  private constructor(expenseService: ExpenseService) {
    this.expenseService = expenseService;
  }

  public static getInstance(
    expenseService: ExpenseService = ExpenseService.getInstance(),
  ): ExpenseController {
    if (!ExpenseController.instance) {
      ExpenseController.instance = new ExpenseController(expenseService);
    }
    return ExpenseController.instance;
  }

  async createExpense(
    userId: string,
    createExpenseRequest: ExpenseRequest,
  ): Promise<HttpResponse> {
    try {
      await validateRequest(createExpenseRequest);
      const createExpenseResponse = await this.expenseService.createExpense(
        userId,
        createExpenseRequest,
      );
      return new HttpResponse({
        statusCode: 201,
        body: createExpenseResponse,
      });
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  async getExpenses(userId: string): Promise<HttpResponse> {
    try {
      const multipleExpensesResponse =
        await this.expenseService.getExpenses(userId);
      return new HttpResponse({
        statusCode: 200,
        body: multipleExpensesResponse,
      });
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  private handleErrors(error: any): HttpResponse {
    if (error instanceof CustomValidationError) {
      return new HttpResponse({
        statusCode: 400,
        body: { error: error.validationErrors },
      });
    }
    return new HttpResponse({
      statusCode: 500,
      body: {
        error: error.message,
      },
    });
  }
}
