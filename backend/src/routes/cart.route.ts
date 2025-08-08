import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller";
const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.patch("/:id", protectRoute, updateQuantity);
router.delete("/", protectRoute, removeAllFromCart);

export default router;
