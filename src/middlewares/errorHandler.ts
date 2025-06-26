import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.message === "jwt expired") err = expiredToken;
  if (err.message === "invalid token") err = invalidToken;

  if (process.env.DEV_NODE === "production") {
    envProd(err, res);
  } else {
    envDev(err, res);
  }
};

const envDev = (err: Error, res: Response) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const state = err instanceof ApiError ? err.state : "error";
  res.status(statusCode).json({
    status: state,
    message: err.message,
    stack: err.stack,
  });
};

const envProd = (err: Error, res: Response) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const state = err instanceof ApiError ? err.state : "error";
  res.status(statusCode).json({
    status: state,
    message: err.message,
  });
};

const invalidToken = new ApiError("Invalid Token , Please login again...", 401);
const expiredToken = new ApiError("Token Expired, Please login again...", 401);
