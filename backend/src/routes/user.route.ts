import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { updateAddress } from "../controllers/user.controller";
const router = express.Router();



router.patch("/address",protectRoute,updateAddress);

export default router;
