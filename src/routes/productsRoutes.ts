import express, { Request, Response, NextFunction } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productsControllers";
import { multiUpload } from "../middlewares/upload";
import {
  validatorCreateProduct,
  validatorUpdateProduct,
} from "../utils/validators/product.validator";
import { handleImages } from "../middlewares/handleImagesToBody";
import { allowedTo, protectAuth } from "../controllers/authControllers";
const router = express.Router();

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("admin"),
    multiUpload,
    handleImages,
    validatorCreateProduct,
    createProduct
  )
  .get(protectAuth, getAllProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(multiUpload, handleImages, validatorUpdateProduct, updateProduct)
  .delete(deleteProduct);

export default router;
