import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { response_success } from "$utils/response.utils";

export async function login(req: Request, res: Response): Promise<Response> {
  const { userId } = req.body as { userId?: string };

  if (!userId) {
    return res.status(400).json({
      status: false,
      message: "userId is required",
      errors: [],
    });
  }

  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return response_success(res, { token }, "Success");
}
