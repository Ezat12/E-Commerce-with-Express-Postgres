import { Request, Response, NextFunction } from "express";

export const handleImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Express.Multer.File[];
  const file = req.file as Express.Multer.File;
  if (Array.isArray(files)) {
    const images = files?.map(
      (file: Express.Multer.File) => `/uploads/${file.filename}`
    );
    req.body.images = images;
  } else if (file) {
    req.body.image = file.filename;
  }
  next();
};
