import express from "express";
import verifyToken from "../middleware/authMiddleware";
import ExpenseRequest from "../dto/ExpenseRequest";
import { ExpenseController } from "../controllers/ExpenseController";
const router = express.Router();

const expenseController = ExpenseController.getInstance();
router.post(
  "/",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;
    const createExpenseRequest = new ExpenseRequest({
      amount: req.body.amount,
      currency: req.body.currency,
      expenseCategoryId: req.body.expenseCategoryId,
      date: new Date(req.body.date),
      description: req.body.description,
    });
    const createExpenseResponse = await expenseController.createExpense(
      userId,
      createExpenseRequest,
    );
    res
      .status(createExpenseResponse.statusCode)
      .json(createExpenseResponse.body);
  },
);

router.get(
  "/",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;

    const multipleExpensesResponse =
      await expenseController.getExpenses(userId);
    res
      .status(multipleExpensesResponse.statusCode)
      .json(multipleExpensesResponse.body);
  },
);

router.get(
  "/:expenseId",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;
    const expenseId = req.params.expenseId;
    const expenseResponse = await expenseController.getExpenseById(
      userId,
      expenseId,
    );
    res.status(expenseResponse.statusCode).json(expenseResponse.body);
  },
);

router.delete(
  "/:expenseId",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;
    const expenseId = req.params.expenseId;
    const expenseResponse = await expenseController.deleteExpense(
      userId,
      expenseId,
    );
    res.status(expenseResponse.statusCode).json(expenseResponse.body);
  },
);

export default router;
