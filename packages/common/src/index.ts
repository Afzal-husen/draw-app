import { z } from "zod";

export const signupSchema = z.object({
  userName: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(3, { message: "Password must be atleast 3 characters" }),
});

export const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(3, { message: "Password must be atleast 3 characters" }),
});

export const createRoomSchema = z.object({
  roomId: z.string(),
});
