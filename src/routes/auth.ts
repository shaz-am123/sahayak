import express from "express";
const router = express.Router();
import userController from "../controllers/UserController";
import authController from "../controllers/AuthController";
import RegistrationRequest from "../dto/RegistrationRequest";
import LoginRequest from "../dto/LoginRequest";

router.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    const registrationRequest = new RegistrationRequest(
      req.body.name,
      req.body.username,
      req.body.password
    );

    const registrationResponse = await userController.registerUser(registrationRequest);
    res.status(registrationResponse.status).json(registrationResponse.body);
  }
);

router.post("/login", async (req: express.Request, res: express.Response) => {
  const loginRequest: LoginRequest = req.body as LoginRequest;
  const loginResponse = await authController.login(loginRequest);
  res.status(loginResponse.status).json(loginResponse.body);
});

export default router;
