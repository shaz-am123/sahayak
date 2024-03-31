import Category from "../domain/Category";
import CreateCategoryRequest from "../dto/CreateCategoryRequest";
import CreateCategoryResponse from "../dto/CreateCategoryResponse";
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
    createCategoryRequest: CreateCategoryRequest
  ): Promise<CreateCategoryResponse> {
    const category = new Category({
      id: null,
      userId: userId,
      name: createCategoryRequest.name,
      description: createCategoryRequest.description,
    });
    const createdCategory = await this.categoryRepository.createCategory(
      category
    );
    return new CreateCategoryResponse({
      id: createdCategory.id!,
      userId: createdCategory.userId,
      name: createCategoryRequest.name,
      description: createCategoryRequest.description,
    });
  }
}
