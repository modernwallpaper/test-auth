import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import * as z from "zod";
import { FighterSchema, LoginSchema, UpdateUserSchema, UserSchema } from "../lib/schemas.js";
import { getUserByEmail } from "../data/user.js";
import bcrypt from "bcryptjs";
import { db } from "../lib/db.js";
import { generateJWT } from "../lib/token.js";
import { age_group, performance_class } from "@prisma/client";

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

    const fighter = await db.figherData.create({
      data: {
        id: user.id, 
        weight: "",
        weight_class: "T68",
        kup: "K1",
        gender: "MALE",
        age_group: "SENIOR",
        performance_class: "ONE",
        date_of_birth: new Date(0)
      },
    });

    generateJWT(res, user.id);

    res.status(200).json({ user, fighter });
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
  
  let fighterData = await db.figherData.findUnique({where: { id: req.user?.id }});

  res.status(200).json({ user: user, fighter: fighterData });
});

/** 
 * @description Api controller to update a user profile.
 * PUT /api/users/profile
 * @access Private
*/
const update = asyncHandler(async (req: Request, res: Response) => {
  const data: z.infer<typeof UpdateUserSchema> = req.body.user;
  const fighterData: z.infer<typeof FighterSchema> = req.body.fighter;
  const fields = UpdateUserSchema.safeParse(data);
  const fighter_fields = FighterSchema.safeParse(fighterData);

  if(!fighter_fields.success) {
    res.status(401)
    throw new Error("Inavlid Fields");
  }

  if(!fields.success) {
    res.status(401);
    throw new Error("Invalid Fields");
  }

  const { weight, gender, weight_class, kup, date_of_birth, age_group, performance_class } = fighter_fields.data;
  const updateFighterData: Partial<typeof fighter_fields.data> = {}

  const { name, email, password, id } = fields.data;
  const updateData: Partial<typeof fields.data> = {};

  if(name) updateData.name = name;
  if(email) updateData.email = email;
  if(password) updateData.password = await bcrypt.hash(password, 12);
  if(weight) updateFighterData.weight = weight;
  if(weight_class) updateFighterData.weight_class = weight_class;
  if(kup) updateFighterData.kup = kup;
  if(date_of_birth) updateFighterData.date_of_birth = date_of_birth;
  if(age_group) updateFighterData.age_group = age_group;
  if(performance_class) updateFighterData.performance_class = performance_class;
  if(gender) updateFighterData.gender = gender;

  if(Object.keys(updateData).length === 0 && Object.keys(updateFighterData).length === 0) {
    res.status(400);
    throw new Error("No fields to udpate");
  }

  const updatedUser = await db.user.update({
    where: { id: id },
    data: updateData,
  });

  const updateFighter = await db.figherData.update({
    where: { id: id },
    data: fighterData,
  });

  res.status(200).json({user: updatedUser, fighter: updateFighter});
});

export {
  login,
  register,
  logout,
  profile,
  update,
};
