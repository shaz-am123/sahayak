const router = require("express").Router();
import userController from '../controllers/UserController';
import verifyToken from '../middleware/authMiddleware';

// router.get("/", verifyToken, userController.getUsers);
export default router;
