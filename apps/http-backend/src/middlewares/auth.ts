import { RequestHandler } from "express";
import { CustomError } from "./custom-error";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticate: RequestHandler = (req, res, next) => {
  try {
    if (
      !req.headers.authorization?.startsWith("Bearer") ||
      !req.headers.authorization?.split(" ")[1]
    )
      return next(new CustomError(403, "Invalid token"));

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next(new CustomError(404, "Token not found"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || (decoded as JwtPayload).userId) {
      return next(new CustomError(400, "bad request"));
    } else {
      // @ts-ignore
      req.userId = decoded.userId;
      next();
    }
  } catch (error) {
    next(error);
  }
};
