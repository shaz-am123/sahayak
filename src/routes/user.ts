const router = require("express").Router();
const userController = require('../controllers/UserController');
const verifyToken = require('../middleware/authMiddleware');

// router.get("/", verifyToken, userController.getUsers);
export default router;
