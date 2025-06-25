import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userControllers";
import { singleUpload, upload } from "../middlewares/upload";
import { handleImages } from "../middlewares/handleImagesToBody";
import {
  validateUserCreation,
  validateUserUpdate,
} from "../utils/validators/user.validator";
const router = express.Router();

router
  .route("/")
  .post(
    upload.single("avatar"),
    handleImages,
    ...validateUserCreation,
    createUser
  )
  .get(getAllUsers);
router
  .route("/:id")
  .get(getUserById)
  .put(upload.single("avatar"), handleImages, ...validateUserUpdate, updateUser)
  .delete(deleteUser);

export default router;
