import {
  createOrder,
  getAllOrdersUser,
} from "../controllers/ordersControllers";
import { allowedTo } from "../controllers/authControllers";
import { protectAuth } from "../controllers/authControllers";
import express from "express";
const router = express.Router();

router
  .route("/")
  .post(protectAuth, allowedTo("user"), createOrder)
  .get(protectAuth, allowedTo("user"), getAllOrdersUser);

export default router;
