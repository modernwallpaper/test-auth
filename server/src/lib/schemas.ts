import * as z from "zod";

const UserSchema = z.object({
  name: z.string({ message: "Name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, { message: "Password must have a minimum of 6 Characters" }),
});

const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  id: z.string(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export { UserSchema, LoginSchema, UpdateUserSchema };
