import ExpenseCategory from "../domain/ExpenseCategory";
import ExpenseCategoryModel from "../models/ExpenseCategoryModel";

export class CategoryRepository {
  private static instance: CategoryRepository;

  public static getInstance(): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository();
    }
    return CategoryRepository.instance;
  }

  async createCategory(category: ExpenseCategory): Promise<ExpenseCategory> {
    const categoryEntity = new ExpenseCategoryModel({ ...category });
    await categoryEntity.save();
    return new ExpenseCategory({
      id: categoryEntity.id.toString(),
      name: categoryEntity.name,
      description: categoryEntity.description,
      userId: categoryEntity.userId.toString(),
    });
  }

  async getExpenseCategories(userId: string): Promise<ExpenseCategory[]> {
    const expenseCategoryEntities = await ExpenseCategoryModel.find({
      userId: userId,
    });
    return expenseCategoryEntities.map((expenseCategoryEntity) => {
      return new ExpenseCategory({
        id: expenseCategoryEntity.id,
        userId: expenseCategoryEntity.userId.toString(),
        name: expenseCategoryEntity.name,
        description: expenseCategoryEntity.description,
      });
    });
  }

  async getExpenseCategoryById(
    userId: string,
    expenseCategoryId: string,
  ): Promise<ExpenseCategory> {
    const expenseCategory = await ExpenseCategoryModel.findOne({
      id: expenseCategoryId,
      userId: userId,
    });

    if (!expenseCategory)
      throw new Error("ExpenseCategory not found for given user");

    return new ExpenseCategory({
      id: expenseCategory.id,
      userId: expenseCategory.userId.toString(),
      name: expenseCategory.name,
      description: expenseCategory.description,
    });
  }
}
