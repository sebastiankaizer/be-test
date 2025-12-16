import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  user?: { userId: string };
}

export function authMiddleware(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
      errors: [],
    });
  }

  try {
    const token = header.replace("Bearer ", "");
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
      errors: [],
    });
  }
}