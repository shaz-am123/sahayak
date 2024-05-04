import { ExpenseQueryParams } from "./../queryParams/ExpenseQueryParams";
import Expense from "../domain/Expense";
import ExpenseCategory from "../domain/ExpenseCategory";
import ExpenseCategoryResponse from "../dto/ExpenseCategoryResponse";
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
    const expense = new Expense({
      id: null,
      userId: userId,
      amount: createExpenseRequest.amount,
      expenseCategoryId: createExpenseRequest.expenseCategoryId,
      description: createExpenseRequest.description,
      date: createExpenseRequest.date,
    });

    const expenseCount = await this.categoryService.getExpenseCount(
      userId,
      createExpenseRequest.expenseCategoryId,
    );
    const createdExpense = await this.expenseRepository.createExpense(expense);

    const expenseCategoryResponse =
      await this.categoryService.updateExpenseCategory(
        userId,
        createExpenseRequest.expenseCategoryId,
        {
          expenseCount: expenseCount + 1,
        },
      );

    return new ExpenseResponse({
      id: createdExpense.id!,
      userId: createdExpense.userId,
      amount: createdExpense.amount,
      expenseCategory: expenseCategoryResponse,
      description: createdExpense.description,
      date: createdExpense.date,
    });
  }

  async getExpenses(
    userId: string,
    expenseQueryParams: ExpenseQueryParams,
  ): Promise<MultipleExpensesResponse> {
    var expenses = await this.expenseRepository.getExpenses(userId);
    if (expenseQueryParams.expenseCategories) {
      expenses = expenses.filter((expense) =>
        expenseQueryParams.expenseCategories!.includes(
          expense.expenseCategoryId,
        ),
      );
    }

    if (expenseQueryParams.startDate && expenseQueryParams.endDate) {
      expenses = expenses.filter(
        (expense) =>
          expense.date >= expenseQueryParams.startDate! &&
          expense.date <= expenseQueryParams.endDate!,
      );
    }
    const idToExpenseCategoryMap = new Map<string, ExpenseCategory>();

    const { expenseCategories } =
      await this.categoryService.getExpenseCategories(userId);

    expenseCategories.forEach((category) => {
      idToExpenseCategoryMap.set(category.id, category);
    });

    const expenseResponses = expenses.map((expense) => {
      const expenseCategoryResponse = idToExpenseCategoryMap.get(
        expense.expenseCategoryId,
      )!;
      return new ExpenseResponse({
        id: expense.id!,
        userId: expense.userId,
        amount: expense.amount,
        expenseCategory: new ExpenseCategoryResponse({
          ...expenseCategoryResponse,
          id: expenseCategoryResponse.id!,
        }),
        description: expense.description,
        date: expense.date,
      });
    });

    return new MultipleExpensesResponse({
      expenses: expenseResponses,
      totalRecords: expenses.length,
    });
  }

  async getExpenseById(
    userId: string,
    expenseId: string,
  ): Promise<ExpenseResponse> {
    const expense = await this.expenseRepository.getExpenseById(
      userId,
      expenseId,
    );

    const expenseCategoryResponse =
      await this.categoryService.getExpenseCategoryById(
        userId,
        expense.expenseCategoryId,
      );

    return new ExpenseResponse({
      id: expense.id!,
      userId: expense.userId,
      amount: expense.amount,
      expenseCategory: new ExpenseCategoryResponse({
        ...expenseCategoryResponse,
        id: expenseCategoryResponse.id!,
      }),
      description: expense.description,
      date: expense.date,
    });
  }

  async deleteExpense(
    userId: string,
    expenseId: string,
  ): Promise<ExpenseResponse> {
    const expense = await this.expenseRepository.deleteExpense(
      userId,
      expenseId,
    );

    const expenseCount = await this.categoryService.getExpenseCount(
      userId,
      expense.expenseCategoryId,
    );

    const newExpenseCategoryResponse =
      await this.categoryService.updateExpenseCategory(
        userId,
        expense.expenseCategoryId,
        {
          expenseCount: expenseCount - 1,
        },
      );

    return new ExpenseResponse({
      id: expense.id!,
      userId: expense.userId,
      amount: expense.amount,
      expenseCategory: new ExpenseCategoryResponse({
        ...newExpenseCategoryResponse,
        id: newExpenseCategoryResponse.id!,
      }),
      description: expense.description,
      date: expense.date,
    });
  }

  async updateExpense(
    userId: string,
    expenseId: string,
    updates: Partial<ExpenseRequest>,
  ): Promise<ExpenseResponse> {
    await this.expenseRepository.updateExpense(userId, expenseId, updates);

    return this.getExpenseById(userId, expenseId);
  }
}
