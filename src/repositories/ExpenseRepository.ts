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

  async getExpenseCategories(userId: string): Promise<Expense[]> {
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
}
