import express, { Router } from "express";
import { createRoom, signin, signup } from "../controllers";
import { authenticate } from "../middlewares/auth";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/create", authenticate, createRoom);

export default router;
