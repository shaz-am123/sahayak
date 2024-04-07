import Expense from "../domain/Expense";
import ExpenseRequest from "../dto/ExpenseRequest";
import ExpenseResponse from "../dto/ExpenseResponse";
import MultipleExpensesResponse from "../dto/MultipleExpensesResponse";
import { ExpenseRepository } from "../repositories/ExpenseRepository";
import { CategoryService } from "./CategoryService";

export class ExpenseService {
  private static instance: ExpenseService;
  private categoryService: CategoryService;
  private expenseRepository: ExpenseRepository;

  private constructor(
    expenseRepository: ExpenseRepository,
    categoryService: CategoryService,
  ) {
    this.expenseRepository = expenseRepository;
    this.categoryService = categoryService;
  }

  public static getInstance(
    expenseRepository: ExpenseRepository = ExpenseRepository.getInstance(),
    categoryService: CategoryService = CategoryService.getInstance(),
  ): ExpenseService {
    if (!ExpenseService.instance) {
      ExpenseService.instance = new ExpenseService(
        expenseRepository,
        categoryService,
      );
    }
    return ExpenseService.instance;
  }

  async createExpense(
    userId: string,
    createExpenseRequest: ExpenseRequest,
  ): Promise<ExpenseResponse> {
    const expenseCategory = await this.categoryService.getExpenseCategoryById(
      userId,
      createExpenseRequest.expenseCategoryId,
    );

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
      expenseCategory: expenseCategory,
      description: createdExpense.description,
      date: createdExpense.date,
    });
  }

  async getExpenses(userId: string): Promise<MultipleExpensesResponse> {
    const expenses = await this.expenseRepository.getExpenses(userId);
    const expenseResponses = expenses.map(async (expense) => {
      const expenseCategory = await this.categoryService.getExpenseCategoryById(
        userId,
        expense.expenseCategoryId,
      );
      return new ExpenseResponse({
        id: expense.id!,
        userId: expense.userId,
        amount: expense.amount,
        currency: expense.currency,
        expenseCategory: expenseCategory,
        description: expense.description,
        date: expense.date,
      });
    });

    return new MultipleExpensesResponse({
      expenses: await Promise.all(expenseResponses),
      totalRecords: expenses.length,
    });
  }
}
