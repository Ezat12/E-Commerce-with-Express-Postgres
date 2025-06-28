import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAllAddresses,
  getMyAddresses,
  updateAddress,
} from "../controllers/addressesControllers";
import { allowedTo } from "../controllers/authControllers";
import { protectAuth } from "../controllers/authControllers";
import express from "express";
import {
  validatorCreateAddress,
  validatorUpdateAddress,
} from "../utils/validators/addresses.validator";

const router = express.Router();

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("user", "admin"),
    validatorCreateAddress,
    createAddress
  )
  .get(protectAuth, allowedTo("admin", "user"), getAllAddresses);

router.get(
  "/getMyAddresses",
  protectAuth,
  allowedTo("user", "admin"),
  getMyAddresses
);

router
  .route("/:id")
  .get(protectAuth, allowedTo("admin", "user"), getAddressById)
  .put(protectAuth, allowedTo("user"), validatorUpdateAddress, updateAddress)
  .delete(protectAuth, allowedTo("admin", "user"), deleteAddress);

export default router;
