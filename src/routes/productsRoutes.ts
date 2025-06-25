import express, { Request, Response, NextFunction } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productsControllers";
import { multiUpload } from "../middlewares/upload";
import { validatorCreateProduct } from "../utils/validators/product.validator";
import { handleImages } from "../middlewares/handleImagesToBody";
const router = express.Router();

router
  .route("/")
  .post(multiUpload, handleImages, validatorCreateProduct, createProduct)
  .get(getAllProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
