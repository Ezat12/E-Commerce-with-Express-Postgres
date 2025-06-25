import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import { promises as fs } from "fs";

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

const ensureUploadsDir = async () => {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: async (req: Request, file, cb) => {
    await ensureUploadsDir();
    cb(null, UPLOADS_DIR);
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fileName = `image-${uniqueSuffix}${ext}`;
    console.log("Saving file:", fileName);
    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, webp, avif)"));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export const singleUpload = upload.single("image");
export const multiUpload = upload.array("images", 5);
