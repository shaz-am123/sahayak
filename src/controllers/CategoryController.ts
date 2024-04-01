import ExpenseCategoryRequest from "../dto/ExpenseCategoryRequest";
import HttpResponse from "../dto/HttpResponse";
import { CustomValidationError } from "../errors/CustomValidationError";
import { CategoryService } from "../services/CategoryService";

export class CategoryController {
  getCategories(userId: string) {
    throw new Error("Method not implemented.");
  }
  private static instance: CategoryController;
  private categoryService: CategoryService;

  private constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  public static getInstance(
    categoryService: CategoryService = CategoryService.getInstance()
  ): CategoryController {
    if (!CategoryController.instance) {
      CategoryController.instance = new CategoryController(categoryService);
    }
    return CategoryController.instance;
  }

  async createCategory(
    userId: string,
    createCategoryRequest: ExpenseCategoryRequest
  ): Promise<HttpResponse> {
    try {
      await createCategoryRequest.validateRequest();
      const createCategoryResponse = await this.categoryService.createCategory(
        userId,
        createCategoryRequest
      );
      return new HttpResponse({
        statusCode: 201,
        body: createCategoryResponse,
      });
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  private handleErrors(error: any): HttpResponse {
    if (error instanceof CustomValidationError) {
      return new HttpResponse({
        statusCode: 400,
        body: { error: error.validationErrors },
      });
    }
    return new HttpResponse({
      statusCode: 500,
      body: {
        error: error.message,
      },
    });
  }
}
