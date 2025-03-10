import { RequestHandler } from "express";

const signup: RequestHandler = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const signin: RequestHandler = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const createRoom: RequestHandler = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export { signin, signup, createRoom };
