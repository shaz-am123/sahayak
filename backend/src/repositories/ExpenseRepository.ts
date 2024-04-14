import Expense from "../domain/Expense";
import Currency from "../enums/Currency";
import ExpenseModel from "../models/ExpenseModel";

export class ExpenseRepository {
  private static instance: ExpenseRepository;

  public static getInstance(): ExpenseRepository {
    if (!ExpenseRepository.instance) {
      ExpenseRepository.instance = new ExpenseRepository();
    }
    return ExpenseRepository.instance;
  }

  async createExpense(expense: Expense): Promise<Expense> {
    const expenseEntity = new ExpenseModel({ ...expense });
    await expenseEntity.save();
    return new Expense({
      id: expenseEntity.id,
      userId: expenseEntity.userId.toString(),
      amount: expenseEntity.amount,
      currency: Currency[expenseEntity.currency as keyof typeof Currency],
      expenseCategoryId: expenseEntity.expenseCategoryId,
      description: expenseEntity.description,
      date: expenseEntity.date,
    });
  }

  async getExpenses(userId: string): Promise<Expense[]> {
    const expenseEntities = await ExpenseModel.find({
      userId: userId,
    });
    return expenseEntities.map((expenseEntity) => {
      return new Expense({
        id: expenseEntity.id,
        userId: expenseEntity.userId.toString(),
        amount: expenseEntity.amount,
        currency: Currency[expenseEntity.currency as keyof typeof Currency],
        expenseCategoryId: expenseEntity.expenseCategoryId,
        description: expenseEntity.description,
        date: expenseEntity.date,
      });
    });
  }

  async getExpenseById(userId: string, expenseId: string): Promise<Expense> {
    const expense = await ExpenseModel.findOne({
      id: expenseId,
      userId: userId,
    });

    if (!expense) throw new Error("Expense not found for given user");

    return new Expense({
      id: expense.id,
      userId: expense.userId.toString(),
      amount: expense.amount,
      currency: Currency[expense.currency as keyof typeof Currency],
      expenseCategoryId: expense.expenseCategoryId,
      description: expense.description,
      date: expense.date,
    });
  }

  async deleteExpense(userId: string, expenseId: string): Promise<Expense> {
    const expense = await ExpenseModel.findOneAndDelete({
      id: expenseId,
      userId: userId,
    });

    if (!expense) {
      throw new Error("Expense not found for given user");
    }

    return new Expense({
      id: expense.id,
      userId: expense.userId.toString(),
      amount: expense.amount,
      currency: Currency[expense.currency as keyof typeof Currency],
      expenseCategoryId: expense.expenseCategoryId,
      description: expense.description,
      date: expense.date,
    });
  }

  async updateExpense(
    userId: string,
    expenseId: string,
    updates: Object,
  ): Promise<void> {
    const updatedExpense = await ExpenseModel.findOneAndUpdate(
      { id: expenseId, userId: userId },
      updates,
      { new: true },
    );

    if (!updatedExpense) throw new Error("Expense not found for given user");
  }
}
