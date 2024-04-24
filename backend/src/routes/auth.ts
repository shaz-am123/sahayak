import express from "express";
const router = express.Router();
import { AuthController } from "../controllers/AuthController";
import RegistrationRequest from "../dto/RegistrationRequest";
import LoginRequest from "../dto/LoginRequest";
import verifyToken from "../middleware/authMiddleware";

const authController = AuthController.getInstance();

router.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    const registrationRequest = new RegistrationRequest({
      name: req.body.name,
      emailAddress: req.body.emailAddress,
      username: req.body.username,
      password: req.body.password,
    });

    const registrationResponse =
      await authController.registerUser(registrationRequest);
    res.status(registrationResponse.statusCode).json(registrationResponse.body);
  },
);

router.post("/login", async (req: express.Request, res: express.Response) => {
  const loginRequest = new LoginRequest({
    username: req.body.username,
    password: req.body.password,
  });
  const loginResponse = await authController.login(loginRequest);
  res.status(loginResponse.statusCode).json(loginResponse.body);
});

router.get(
  "/user",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const userResponse = await authController.getUser(req.userId!);
    res.status(userResponse.statusCode).json(userResponse.body);
  },
);

export default router;
