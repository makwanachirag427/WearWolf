import { useState } from "react";
import CartItem from "../components/CartItem";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { Phone, SquarePen, TriangleAlert } from "lucide-react";
import UpdateAddress from "../components/UpdateAddressModal";
import SpotlightCard from "../components/SpotlightCard/SpotlightCard";
import EmptyCartPage from "./EmptyCartPage";
import { motion } from "framer-motion";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = () => {
  const { cartItems } = useCartStore();
  const { user } = useAuthStore();
  const [isUpdatingAddress, setIsUpdatingAddress] = useState<boolean>(false);

  return (
    <div className="pt-20  h-full  p-8 relative ">
      {cartItems.length === 0 ? (
        <EmptyCartPage />
      ) : (
        <div className="flex flex-col gap-5">
          {/* Address */}
          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full lg:w-[50%]"
          >
            {!user?.address ? (
              <div>
                <button
                  onClick={() => setIsUpdatingAddress(true)}
                  hidden={isUpdatingAddress}
                  className="text-yellow-300 text-sm font-semibold border border-yellow-300 py-1 px-2 rounded-md flex gap-2 items-center hover:underline"
                >
                  <TriangleAlert className="size-5" />
                  No address provided.Please add address here
                </button>
              </div>
            ) : (
              <SpotlightCard
                className="custom-spotlight-card w-full  flex items-center justify-between gap-2"
                spotlightColor="rgba(255, 0, 0, 0.10)"
              >
                <div className="flex flex-col justify-center">
                  <h3 className="font-semibold text-yellow-300">
                    Your shipping address:
                  </h3>
                  <div className="text-sm font-semibold text-yellow-300 flex flex-col sm:flex-row sm:flex-wrap sm:leading-none sm:gap-0.5 sm:items-center">
                    <p>{user.address.fullName},</p>
                    <p>
                      {user.address.street}, {user.address.city},
                    </p>
                    <p>
                      {user.address.state}, {user.address.postalCode},
                    </p>
                    <p>{user.address.country},</p>
                    <p className="flex items-center gap-1">
                      <Phone className="size-4" /> {user.address.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUpdatingAddress(true)}
                  className="text-yellow-300 hover:text-red-600 transition"
                >
                  <SquarePen className="size-5 stroke-2" />
                </button>
              </SpotlightCard>
            )}
            {isUpdatingAddress && (
              <UpdateAddress setIsUpdatingAddress={setIsUpdatingAddress} />
            )}
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-5  h-full lg:justify-between">
            <div className="flex flex-col gap-4 w-full lg:w-[70vw] items-center ">
              {/* Cartitems  */}
              <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full flex flex-col gap-2.5"
              >
                {cartItems.map((cartItem) => (
                  <CartItem key={cartItem._id} cartItem={cartItem} />
                ))}
              </motion.div>
            </div>
            {/* Order summary and GiftCard */}
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col gap-4 lg:w-[calc(25vw)] lg:sticky lg:top-24 lg:self-start"
            >
              <OrderSummary />
              <GiftCouponCard />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CartPage;
