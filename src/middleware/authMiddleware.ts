const dotenv = require("dotenv");
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    await AuthService.getInstance().validateUserId(decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export default verifyToken;
