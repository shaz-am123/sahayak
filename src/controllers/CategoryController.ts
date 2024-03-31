import HttpResponse from "../dto/HttpResponse";
import { CategoryService } from "../services/CategoryService";

export class CategoryController {
  private static instance: CategoryController;
  private authService: CategoryService;

  private constructor(authService: CategoryService) {
    this.authService = authService;
  }

  public static getInstance(
    authService: CategoryService = CategoryService.getInstance()
  ): CategoryController {
    if (!CategoryController.instance) {
      CategoryController.instance = new CategoryController(authService);
    }
    return CategoryController.instance;
  }

  async createCategory(userId: string): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
}
