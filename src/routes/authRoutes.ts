import express from "express";
import { login, signup } from "../controllers/authControllers";
import { upload } from "../middlewares/upload";
import { handleImages } from "../middlewares/handleImagesToBody";
import { validateUserCreation } from "../utils/validators/user.validator";
const router = express.Router();

router
  .route("/signup")
  .post(upload.single("avatar"), handleImages, ...validateUserCreation, signup);
router.route("/login").post(login);

export default router;
