import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getRecommendedProducts,
  toggleFeaturedProducts,
  updateProduct,
} from "../controllers/product.controller";
import { adminRoute, protectRoute } from "../middleware/auth.middleware";
import upload from "../config/multer";
const router = express.Router();

// public routes
router.get("/", getAllProducts);
router.get("/recommendations",getRecommendedProducts);
router.get("/featured", getFeaturedProducts);
router.get("/product/:id", getProductById);

//admin only
router.post(
  "/create",
  protectRoute,
  adminRoute,
  upload.array("images", 4),
  createProduct
);
router.patch("/featured/:id", protectRoute, adminRoute, toggleFeaturedProducts);
router.patch("/:id", protectRoute, adminRoute, updateProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
