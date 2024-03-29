const router = require("express").Router();
import verifyToken from '../middleware/authMiddleware';

// router.get("/", verifyToken, userController.getUsers);
export default router;
