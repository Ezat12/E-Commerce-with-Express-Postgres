import { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";

export const validator = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
  }
  next();

};
