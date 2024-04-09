import ExpenseCategory from "../domain/ExpenseCategory";
import ExpenseCategoryRequest from "../dto/ExpenseCategoryRequest";
import ExpenseCategoryResponse from "../dto/ExpenseCategoryResponse";
import MultipleExpenseCategoriesResponse from "../dto/MultipleExpenseCategoriesResponse";
import { CategoryRepository } from "../repositories/CategoryRepository";

export class CategoryService {
  private static instance: CategoryService;
  private categoryRepository: CategoryRepository;

  private constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public static getInstance(
    categoryRepository: CategoryRepository = CategoryRepository.getInstance(),
  ): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService(categoryRepository);
    }
    return CategoryService.instance;
  }

  async createCategory(
    userId: string,
    createCategoryRequest: ExpenseCategoryRequest,
  ): Promise<ExpenseCategoryResponse> {
    const category = new ExpenseCategory({
      id: null,
      userId: userId,
      name: createCategoryRequest.name,
      description: createCategoryRequest.description,
    });
    const createdCategory =
      await this.categoryRepository.createCategory(category);
    return new ExpenseCategoryResponse({
      id: createdCategory.id!,
      userId: createdCategory.userId,
      name: createCategoryRequest.name,
      description: createCategoryRequest.description,
    });
  }

  async getExpenseCategories(
    userId: string,
  ): Promise<MultipleExpenseCategoriesResponse> {
    const categories =
      await this.categoryRepository.getExpenseCategories(userId);

    return new MultipleExpenseCategoriesResponse({
      expenseCategories: categories.map(
        (category) =>
          new ExpenseCategoryResponse({
            id: category.id!,
            userId: category.userId,
            name: category.name,
            description: category.description,
          }),
      ),
      totalRecords: categories.length,
    });
  }

  async getExpenseCategoryById(
    userId: string,
    expenseCategoryId: string,
  ): Promise<ExpenseCategoryResponse> {
    const expenseCategory =
      await this.categoryRepository.getExpenseCategoryById(
        userId,
        expenseCategoryId,
      );
    return new ExpenseCategoryResponse({
      ...expenseCategory,
      id: expenseCategory.id!,
    });
  }
}
