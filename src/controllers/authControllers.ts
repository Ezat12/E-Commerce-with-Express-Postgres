import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { userSchema as User } from "../schema";
import { db } from "../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { ApiError } from "../utils/apiError";
import { eq } from "drizzle-orm";
dotenv.config();

const getToken = (payload: { id: number }): string => {
  return jwt.sign(payload, process.env.SECRET_KEY as string, {
    expiresIn: "2d",
  });
};

export const signup = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let body = req.body;
    console.log(body);

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    body = {
      ...body,
      password: hashedPassword,
    };

    console.log(hashedPassword);
    if (req.body.image) {
      body = {
        ...body,
        avatar: req.body.image,
      };
    }
    console.log(body);

    const [user] = await db.insert(User).values(body).returning();

    const token = getToken({ id: user.id });

    res.status(201).json({ status: "success", data: user, token });
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ApiError("Please provide both email and password fields.", 400)
      );
    }

    const [user] = await db.select().from(User).where(eq(User.email, email));

    if (!user || (await bcrypt.compare(user.password, password))) {
      return next(new ApiError("Email or password is not correct", 401));
    }

    const token = getToken({ id: user.id });

    res.status(200).json({ status: "success", data: user, token });
  }
);



