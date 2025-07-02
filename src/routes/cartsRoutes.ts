import {
  clearCart,
  createCart,
  deleteCartItem,
  getCartToUser,
  updateCartItemQuantity,
} from "../controllers/cartsControllers";
import { allowedTo } from "../controllers/authControllers";
import { protectAuth } from "../controllers/authControllers";
import express from "express";
const router = express.Router();

router
  .route("/")
  .post(protectAuth, allowedTo("user"), createCart)
  .get(protectAuth, allowedTo("user"), getCartToUser);

router
  .route("/update-quantity/:itemId")
  .put(protectAuth, allowedTo("user"), updateCartItemQuantity);

router
  .route("/delete-item/:itemId")
  .put(protectAuth, allowedTo("user"), deleteCartItem);

router.route("/").delete(protectAuth, allowedTo("user", "admin"), clearCart);
export default router;
