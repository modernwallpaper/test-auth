import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import * as z from "zod";
import { LoginSchema, UpdateUserSchema, UserSchema } from "../lib/schemas.js";
import { getUserByEmail } from "../data/user.js";
import bcrypt from "bcryptjs";
import { db } from "../lib/db.js";
import { generateJWT } from "../lib/token.js";

/** 
 * @description Api controller to login a user.
 * POST /api/auth/login
 * @access Public
*/
const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;

  const validated = LoginSchema.safeParse(data);

  if(!validated.success) {
    throw new Error("Invalid fields");
  }  

  const { email, password } = validated.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser || !existingUser.email) throw new Error("Email does not exist");

  const passwordsMatch = await bcrypt.compare(password, existingUser.password);

  if(existingUser && passwordsMatch) {
    generateJWT(res, existingUser.id);
    res.status(201).json({ 
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      timestamp: existingUser.timestamp,
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

/** 
 * @description Api controller to register a user.
 * POST /api/auth/register
 * @access Public
*/
const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user: z.infer<typeof UserSchema> = req.body;
  const validated = UserSchema.safeParse(user);

  if (!validated.success) {
    throw new Error("Invalid fields");
  }

  const { name, email, password } = validated.data;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  try {
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        timestamp: new Date(),
      },
    });

    generateJWT(res, user.id);

    res.status(200).json({ success: "User created", user: user });
  } catch (err) {
    next(err);
  }
});

/** 
 * @description Api controller to logout a user.
 * POST /api/auth/logout
 * @access Public
*/
const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out successfully" });
});

/** 
 * @description Api controller to get a user profile.
 * GET /api/users/profile
 * @access Private
*/
const profile = asyncHandler(async (req: Request, res: Response) => {
  const user = {
    id: req.user?.id,
    name: req.user?.name,
    email: req.user?.email,
    timestamp: req.user?.timestamp,
  };

  res.status(200).json(user);
});

/** 
 * @description Api controller to update a user profile.
 * PUT /api/users/profile
 * @access Private
*/
const update = asyncHandler(async (req: Request, res: Response) => {
  const data: z.infer<typeof UpdateUserSchema> = req.body;
  const fields = UpdateUserSchema.safeParse(data);

  if(!fields.success) {
    res.status(401);
    throw new Error("Invalid Fields");
  }

  const { name, email, password, id } = fields.data;
  const updateData: Partial<typeof fields.data> = {};

  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 12);

  if(Object.keys(updateData).length === 0) {
    res.status(400);
    throw new Error("No fields to udpate");
  }

  const updatedUser = await db.user.update({
    where: { id: id },
    data: updateData,
  });

  res.status(200).json({updatedUser});
});

export {
  login,
  register,
  logout,
  profile,
  update,
};
