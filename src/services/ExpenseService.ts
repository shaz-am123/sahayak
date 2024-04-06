import Expense from "../domain/Expense";
import ExpenseRequest from "../dto/ExpenseRequest";
import ExpenseResponse from "../dto/ExpenseResponse";
import MultipleExpensesResponse from "../dto/MultipleExpensesResponse";
import { ExpenseRepository } from "../repositories/ExpenseRepository";

export class ExpenseService {
  private static instance: ExpenseService;
  private expenseRepository: ExpenseRepository;

  private constructor(expenseRepository: ExpenseRepository) {
    this.expenseRepository = expenseRepository;
  }

  public static getInstance(
    expenseRepository: ExpenseRepository = ExpenseRepository.getInstance()
  ): ExpenseService {
    if (!ExpenseService.instance) {
      ExpenseService.instance = new ExpenseService(expenseRepository);
    }
    return ExpenseService.instance;
  }

  async createExpense(
    userId: string,
    createExpenseRequest: ExpenseRequest
  ): Promise<ExpenseResponse> {
    const expense = new Expense({
      id: null,
      userId: userId,
      amount: createExpenseRequest.amount,
      currency: createExpenseRequest.currency,
      expenseCategoryId: createExpenseRequest.expenseCategoryId,
      description: createExpenseRequest.description,
      date: createExpenseRequest.date,
    });
    const createdExpense = await this.expenseRepository.createExpense(expense);
    
    return new ExpenseResponse({
      id: createdExpense.id!,
      userId: createdExpense.userId,
      amount: createdExpense.amount,
      currency: createdExpense.currency,
      expenseCategoryId: createdExpense.expenseCategoryId,
      description: createdExpense.description,
      date: createdExpense.date,
    });
  }

  async getExpenses(userId: string): Promise<MultipleExpensesResponse> {
    const categories = await this.expenseRepository.getExpenseCategories(
      userId
    );

    return new MultipleExpensesResponse({
      expenseCategories: categories.map(
        (expense) =>
          new ExpenseResponse({
            id: expense.id!,
            userId: expense.userId,
            amount: expense.amount,
            currency: expense.currency,
            expenseCategoryId: expense.expenseCategoryId,
            description: expense.description,
            date: expense.date,
          })
      ),
      totalRecords: categories.length,
    });
  }
}
