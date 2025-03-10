import { ErrorRequestHandler } from "express";
import { CustomError } from "./custom-error";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  res.status(statusCode).json({ error: true, message, statusCode });
};
