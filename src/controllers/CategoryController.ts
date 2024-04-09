import ExpenseCategoryRequest from "../dto/ExpenseCategoryRequest";
import HttpResponse from "../dto/HttpResponse";
import validateRequest from "../dto/ValidateRequestDto";
import { CustomValidationError } from "../errors/CustomValidationError";
import { CategoryService } from "../services/CategoryService";

export class CategoryController {
  private static instance: CategoryController;
  private categoryService: CategoryService;

  private constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  public static getInstance(
    categoryService: CategoryService = CategoryService.getInstance(),
  ): CategoryController {
    if (!CategoryController.instance) {
      CategoryController.instance = new CategoryController(categoryService);
    }
    return CategoryController.instance;
  }

  async createCategory(
    userId: string,
    createCategoryRequest: ExpenseCategoryRequest,
  ): Promise<HttpResponse> {
    try {
      await validateRequest(createCategoryRequest);
      const createCategoryResponse = await this.categoryService.createCategory(
        userId,
        createCategoryRequest,
      );
      return new HttpResponse({
        statusCode: 201,
        body: createCategoryResponse,
      });
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  async getExpenseCategories(userId: string): Promise<HttpResponse> {
    try {
      const multipleExpenseCategoriesResponse =
        await this.categoryService.getExpenseCategories(userId);
      return new HttpResponse({
        statusCode: 200,
        body: multipleExpenseCategoriesResponse,
      });
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  async getExpenseCategoryById(
    userId: string,
    exepenseCategoryId: string,
  ): Promise<HttpResponse> {
    try {
      const expenseCategoryResponse =
        await this.categoryService.getExpenseCategoryById(
          userId,
          exepenseCategoryId,
        );
      return new HttpResponse({
        statusCode: 200,
        body: expenseCategoryResponse,
      });
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  async deleteExpenseCategory(
    userId: string,
    exepenseCategoryId: string,
  ): Promise<HttpResponse> {
    try {
      const expenseCategoryResponse =
        await this.categoryService.deleteExpenseCategory(
          userId,
          exepenseCategoryId,
        );
      return new HttpResponse({
        statusCode: 200,
        body: expenseCategoryResponse,
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
