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
      id: categoryEntity._id.toString(),
      name: categoryEntity.name,
      description: categoryEntity.description,
      userId: categoryEntity.userId,
    });
  }
  async getExpenseCategories(userId: string): Promise<ExpenseCategory[]> {
    const expenseCategoryEntities = await ExpenseCategoryModel.find({
      userId: userId,
    });
    return expenseCategoryEntities.map((expenseCategoryEntity) => {
      return new ExpenseCategory({
        id: expenseCategoryEntity._id.toString(),
        userId: expenseCategoryEntity.userId,
        name: expenseCategoryEntity.name,
        description: expenseCategoryEntity.description,
      });
    });
  }
}
