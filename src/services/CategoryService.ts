import Category from "../domain/Category";
import ExpenseCategoryRequest from "../dto/ExpenseCategoryRequest";
import ExpenseCategoryResponse from "../dto/ExpenseCategoryResponse";
import { CategoryRepository } from "../repositories/CategoryRepository";

export class CategoryService {
  private static instance: CategoryService;
  private categoryRepository: CategoryRepository;

  private constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public static getInstance(
    categoryRepository: CategoryRepository = CategoryRepository.getInstance()
  ): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService(categoryRepository);
    }
    return CategoryService.instance;
  }

  async createCategory(
    userId: string,
    createCategoryRequest: ExpenseCategoryRequest
  ): Promise<ExpenseCategoryResponse> {
    const category = new Category({
      id: null,
      userId: userId,
      name: createCategoryRequest.name,
      description: createCategoryRequest.description,
    });
    const createdCategory = await this.categoryRepository.createCategory(
      category
    );
    return new ExpenseCategoryResponse({
      id: createdCategory.id!,
      userId: createdCategory.userId,
      name: createCategoryRequest.name,
      description: createCategoryRequest.description,
    });
  }
}
