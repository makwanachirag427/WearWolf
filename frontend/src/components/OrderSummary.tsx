import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import SpotlightCard from "./SpotlightCard/SpotlightCard";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import axios from "../config/axios";

const stripePromise = loadStripe(
  "pk_test_51ReTsYGao2L7MDU8BHUa48umOKaQ52VWPdNcc9cjQXIgfgHh2ToCD9bR7Qm8SaGJtyAEvbKJk5FYeAh7krDGL0Ei00Sz1jD1vb"
);

const OrderSummary = () => {
  const { total, subtotal, coupon, cartItems, isCouponApplied } =
    useCartStore();
  const { user } = useAuthStore();
  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    if (!user?.address)
      return toast.error(
        "Please add a shipping address to continue to checkout."
      );

    const stripe = await stripePromise;

    const res = await axios.post("/payments/create-checkout-session", {
      couponCode: coupon ? coupon?.code : null,
      products: cartItems,
    });

    const session = res.data;
    // console.log(session);
    const result = await stripe?.redirectToCheckout({
      sessionId: session?.id,
    });

    if (result?.error) {
      console.log("Error in handlePayment", result.error);
    }
  };

  return (
    <SpotlightCard
      className="custom-spotlight-card w-full"
      spotlightColor="rgba(255, 0, 0, 0.10)"
    >
      <div className="flex flex-col gap-2 p-2">
        <h3 className="font-semibold text-xl text-red-600">Order summary</h3>
        <div className="flex justify justify-between">
          <p className="text-slate-300">Original price</p>
          <p className="font-bold text-gray-200">${formattedSubtotal}</p>
        </div>

        {savings > 0 && (
          <div className="flex justify justify-between">
            <p className="text-slate-300">Savings</p>
            <p className="font-semibold">-${formattedSavings}</p>
          </div>
        )}

        {coupon && isCouponApplied && (
          <div className="flex justify justify-between">
            <p className="text-slate-300">Coupon ({coupon.code})</p>
            <p className="font-semibold text-red-600">
              -{coupon.discountPercentage}%
            </p>
          </div>
        )}
        <div className="flex justify justify-between border-t border-gray-500 py-2">
          <p className="font-bold text-gray-200">Total</p>
          <p className="font-bold text-red-600">${formattedTotal}</p>
        </div>

        <motion.button
          onClick={handlePayment}
          className="w-full py-2 rounded-md bg-red-700 font-semibold  hover:bg-red-800 transition-all duration-200"
        >
          Proceed to checkout
        </motion.button>
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="text-gray-400 ">or</span>
        <Link
          to={"/"}
          className="flex gap-2 items-center text-red-600 underline hover:no-underline"
        >
          Continue Shopping
          <MoveRight className="size-5" />
        </Link>
      </div>
    </SpotlightCard>
  );
};
export default OrderSummary;
