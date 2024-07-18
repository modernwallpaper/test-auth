import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateJWT = (res: Response, userId: string) => {
  const secret = process.env.JWT_SECRET;

  if(!secret) {
    res.status(404);
    throw new Error("The JWT secret was not able to be found on this server");
  }

  const token = jwt.sign({ userId }, secret, {
    expiresIn: "30d",
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}
