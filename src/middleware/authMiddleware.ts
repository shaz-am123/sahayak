const dotenv = require('dotenv');
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export default verifyToken;
