import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { getUserById } from "../data/user.js";

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  token = req.cookies?.jwt;

  if(token) {
    try {
      const secret = process.env.JWT_SECRET;
      if(!secret) {
        res.status(401);
        throw new Error("Unauthorized");
      }
      
      const decoded = jwt.verify(token, secret);

      if(typeof decoded !== "string" && (decoded as JwtPayload).userId) {
        const user = await getUserById((decoded as JwtPayload).userId);
        if(user) {
          req.user = user;
          next();
        } else {
          res.status(401);
          throw new Error("User not found");
        }
      } else {
        res.status(401)
        throw new Error("Unauthorized");
      } 
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized");
  }
});
