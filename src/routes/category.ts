import express from "express";
const router = express.Router();
import { CategoryController } from "../controllers/CategoryController";
import verifyToken from "../middleware/authMiddleware";
import ExpenseCategoryRequest from "../dto/ExpenseCategoryRequest";
import MultipleExpenseCategoriesResponse from "../dto/MultipleExpenseCategoriesResponse";
import HttpResponse from "../dto/HttpResponse";

const categoryController = CategoryController.getInstance();
router.post(
  "/",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;
    const createCategoryRequest = new ExpenseCategoryRequest({
      name: req.body.name,
      description: req.body.description,
    });
    const createCategoryResponse = await categoryController.createCategory(
      userId,
      createCategoryRequest
    );
    res
      .status(createCategoryResponse.statusCode)
      .json(createCategoryResponse.body);
  }
);

router.get(
  "/",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;

    const multipleExpenseCategories =
      await categoryController.getExpenseCategories(userId);
    res
      .status(multipleExpenseCategories.statusCode)
      .json(multipleExpenseCategories.body);
  }
);

export default router;
