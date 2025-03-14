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

    res.status(201).json({ error: false, message: "Signedup successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const signin: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = signinSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return next(new CustomError(400, parsedBody.error.message));
    }
    const user = await prisma.user.findFirst({
      where: { email: parsedBody.data.email },
    });

    if (!user) return next(new CustomError(404, "User not does not exist"));

    const isPasswordMatch = await bcryt.compare(
      parsedBody.data.password,
      user?.password,
    );
    if (!isPasswordMatch)
      return next(new CustomError(400, "Wrong email or password"));

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res
      .status(200)
      .json({ error: false, message: "Login successfull", data: token });
  } catch (error) {
    next(error);
  }
};

const createRoom: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) return next(new CustomError(403, "User unauthorized"));

    const parsedBody = createRoomSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return next(new CustomError(400, parsedBody.error.message));
    }

    await prisma.room.create({
      data: {
        slug: parsedBody.data.roomId,
        adminId: req.userId,
      },
    });

    res
      .status(201)
      .json({ error: false, message: "Room created successfully" });
  } catch (error) {
    next(error);
  }
};

export { signin, signup, createRoom };
