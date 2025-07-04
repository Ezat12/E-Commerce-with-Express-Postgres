import {
  addToWishlist,
  clearWishlistUser,
  deleteWishlistItem,
  getWishlistToUser,
} from "../controllers/wishlistControllers";
import { allowedTo, protectAuth } from "../controllers/authControllers";
import express from "express";
const router = express.Router();

router
  .route("/")
  .post(protectAuth, allowedTo("user"), addToWishlist)
  .get(protectAuth, allowedTo("user"), getWishlistToUser)
  .delete(protectAuth, allowedTo("user"), clearWishlistUser);

router
  .route("/:itemId")
  .put(protectAuth, allowedTo("user"), deleteWishlistItem);

export default router;
