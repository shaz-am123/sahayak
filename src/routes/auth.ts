const express = require("express");
const router = express.Router();
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

router.post("/register", userController.registerUser);
router.post("/login", authController.login);

export default router;
