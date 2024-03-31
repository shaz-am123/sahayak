import { CategoryRepository } from "../repositories/CategoryRepository";

export class CategoryService {
  private static instance: CategoryService;
  private authRepository: CategoryRepository;

  private constructor(authRepository: CategoryRepository) {
    this.authRepository = authRepository;
  }

  public static getInstance(
    authRepository: CategoryRepository = CategoryRepository.getInstance()
  ): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService(authRepository);
    }
    return CategoryService.instance;
  }
 }