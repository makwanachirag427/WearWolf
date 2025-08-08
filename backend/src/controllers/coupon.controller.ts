import { Response } from "express";
import { RequestType } from "../types";
import { HandleError } from "../uitls/error";
import Coupon from "../models/coupon.model";

export const getCoupon = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user?._id,
      isActive: true,
    });
    res.status(200).json(coupon || null);
  } catch (error) {
    HandleError(res, error, "getCoupon controller");
  }
};
export const validateCoupon = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
      code,
      userId: req.user?._id,
      isActive: true,
    });
    if (!coupon) {
      res.status(404).json({ message: "Coupon not found" });
      return;
    }
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      res.status(404).json({ message: "Coupon expired" });
      return;
    }

    res
      .status(200)
      .json({
        message: "Coupon is valid",
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
      });
  } catch (error) {
    HandleError(res, error, "validateCoupon controller");
  }
};

