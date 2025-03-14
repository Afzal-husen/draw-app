import { RequestHandler } from "express";
import { CustomError } from "./custom-error";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";

export const authenticate: RequestHandler = (req, res, next) => {
  try {
    if (
      !req.headers.authorization?.startsWith("Bearer") ||
      !req.headers.authorization?.split(" ")[1]
    )
      return next(new CustomError(403, "Invalid token"));

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next(new CustomError(404, "Token not found"));
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") return;

    if (!decoded || !(decoded as JwtPayload).userId) {
      return next(new CustomError(400, "bad request"));
    } else {
      req.userId = decoded.userId;
      next();
    }
  } catch (error) {
    next(error);
  }
};
