import { RequestHandler } from "express";
import { createRoomSchema, signinSchema, signupSchema } from "@repo/common";
import { CustomError } from "../middlewares/custom-error";

const signup: RequestHandler = (req, res, next) => {
  try {
    const parsedBody = signupSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return next(new CustomError(400, parsedBody.error.message));
    }
  } catch (error) {
    next(error);
  }
};

const signin: RequestHandler = (req, res, next) => {
  try {
    const parsedBody = signinSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return next(new CustomError(400, parsedBody.error.message));
    }
  } catch (error) {
    next(error);
  }
};

const createRoom: RequestHandler = (req, res, next) => {
  try {
    const parsedBody = createRoomSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return next(new CustomError(400, parsedBody.error.message));
    }
  } catch (error) {
    next(error);
  }
};

export { signin, signup, createRoom };
