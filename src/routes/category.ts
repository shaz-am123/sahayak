import express from "express";
const router = express.Router();
import { CategoryController } from "../controllers/CategoryController";
import verifyToken from "../middleware/authMiddleware";
import ExpenseCategoryRequest from "../dto/ExpenseCategoryRequest";

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

export default router;
