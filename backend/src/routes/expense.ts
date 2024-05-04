import express from "express";
import verifyToken from "../middleware/authMiddleware";
import ExpenseRequest from "../dto/ExpenseRequest";
import { ExpenseController } from "../controllers/ExpenseController";
import { ExpenseQueryParams } from "../queryParams/ExpenseQueryParams";
const router = express.Router();

const expenseController = ExpenseController.getInstance();
router.post(
  "/",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;
    const createExpenseRequest = new ExpenseRequest({
      amount: req.body.amount,
      expenseCategoryId: req.body.expenseCategoryId,
      date: new Date(req.body.date),
      description: req.body.description,
    });
    const createExpenseResponse = await expenseController.createExpense(
      userId,
      createExpenseRequest
    );
    res
      .status(createExpenseResponse.statusCode)
      .json(createExpenseResponse.body);
  }
);

router.get(
  "/",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;
    const expenseQueryParams: ExpenseQueryParams = {
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : null,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : null,
      expenseCategories: req.query.expenseCategories
        ? (req.query.expenseCategories as string).split(",")
        : null,
    };
    
    const multipleExpensesResponse = await expenseController.getExpenses(
      userId,
      expenseQueryParams
    );
    res
      .status(multipleExpensesResponse.statusCode)
      .json(multipleExpensesResponse.body);
  }
);

router.get(
  "/:expenseId",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;
    const expenseId = req.params.expenseId;
    const expenseResponse = await expenseController.getExpenseById(
      userId,
      expenseId
    );
    res.status(expenseResponse.statusCode).json(expenseResponse.body);
  }
);

router.delete(
  "/:expenseId",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;
    const expenseId = req.params.expenseId;
    const expenseResponse = await expenseController.deleteExpense(
      userId,
      expenseId
    );
    res.status(expenseResponse.statusCode).json(expenseResponse.body);
  }
);

router.put(
  "/:expenseId",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userId = req.userId!;
    const expenseId = req.params.expenseId;
    const updates: Partial<ExpenseRequest> = { ...req.body };
    const expenseCategoryResponse = await expenseController.updateExpense(
      userId,
      expenseId,
      updates
    );
    res
      .status(expenseCategoryResponse.statusCode)
      .json(expenseCategoryResponse.body);
  }
);

export default router;
