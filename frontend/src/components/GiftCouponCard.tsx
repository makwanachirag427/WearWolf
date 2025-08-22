import { useEffect, useState } from "react";
import SpotlightCard from "./SpotlightCard/SpotlightCard";
import { motion } from "framer-motion";
import { useCartStore } from "../store/useCartStore";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState<string>("");
  const { coupon, isCouponApplied, applyCoupon, removeCoupon, getCoupon } =
    useCartStore();

  useEffect(() => {
    getCoupon();
  }, [getCoupon]);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = () => {
    if (!userInputCode) return;
    applyCoupon(userInputCode);
  };

  const handleRemoveCoupon = async (): Promise<void> => {
    await removeCoupon();
    setUserInputCode("");
  };

  return (
    <SpotlightCard
      className="custom-spotlight-card w-full"
      spotlightColor="rgba(255, 0, 0, 0.10)"
    >
      <div className="space-y-3.5 flex flex-col p-2 items-center justify-center">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="voucher" className="text-gray-300 font-semibold">
            Do you have a voucher or gift card?
          </label>
          <input
            type="text"
            id="voucher"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950 text-gray-400  outline-none bg-gray-700/20 w-full"
          />
        </div>
        <motion.button
          onClick={handleApplyCoupon}
          className="w-full py-2 rounded-md bg-red-700 font-semibold  hover:bg-red-800 transition-all duration-200"
        >
          Apply Coupon
        </motion.button>
        {coupon && isCouponApplied && (
          <div className="w-full flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Remove Coupon</h3>
            <p className="text-sm text-gray-400">
              {coupon.code} - {coupon.discountPercentage}% off
            </p>
            <motion.button
              onClick={handleRemoveCoupon}
              className="w-full py-2 rounded-md bg-gray-200 text-black font-semibold  hover:bg-gray-300 transition-all duration-200"
            >
              Remove Coupon
            </motion.button>
          </div>
        )}
        {coupon && (
          <div className="w-full">
            <h3 className="text-lg font-medium text-gray-200">
              Your Available Coupon:
            </h3>
            <p className="text-sm text-gray-400">
              {coupon.code} - {coupon.discountPercentage}% off
            </p>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
};
export default GiftCouponCard;
