import express from "express";
const router = express.Router();
import { CategoryController } from "../controllers/CategoryController";
import verifyToken from "../middleware/authMiddleware";

const categoryController = CategoryController.getInstance();
router.post("/", verifyToken, async (req: express.Request, res: express.Response) => {
    const userId = req.userId!
    const createCategoryResponse = await categoryController.createCategory(userId)
    res.status(createCategoryResponse.statusCode).json(createCategoryResponse.body)
});

export default router;
