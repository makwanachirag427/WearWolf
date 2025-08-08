import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { checkoutSuccess, createCheckoutSuccess } from "../controllers/payment.controller";
const router = express.Router();

router.post("/create-checkout-success", protectRoute, createCheckoutSuccess);
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;
