import express from "express";
const router = express.Router();
import { AuthController } from "../controllers/AuthController";
import RegistrationRequest from "../dto/RegistrationRequest";
import LoginRequest from "../dto/LoginRequest";

const authController = AuthController.getInstance();

router.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    const registrationRequest = new RegistrationRequest(
      req.body.name,
      req.body.emailAddress,
      req.body.username,
      req.body.password
    );

    const registrationResponse = await authController.registerUser(
      registrationRequest
    );
    res.status(registrationResponse.status).json(registrationResponse.body);
  }
);

router.post("/login", async (req: express.Request, res: express.Response) => {
  const loginRequest = new LoginRequest(req.body.username, req.body.password);
  const loginResponse = await authController.login(loginRequest);
  res.status(loginResponse.status).json(loginResponse.body);
});

export default router;
