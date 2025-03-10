import { RequestHandler } from "express";
import { createRoomSchema, signinSchema, signupSchema } from "@repo/common";
import { CustomError } from "../middlewares/custom-error";
import { prisma } from "@repo/db";
import bcryt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";

const signup: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = signupSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return next(new CustomError(400, parsedBody.error.message));
    }

    const hashedPassword = await bcryt.hash(parsedBody.data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsedBody.data.userName,
        password: hashedPassword,
        email: parsedBody.data.email,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res
      .status(201)
      .json({ error: false, message: "User created successfully" });
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
