import { Minus, Plus, X } from "lucide-react";
import type { CartItemProps } from "../types";
import { getOptimizedImage } from "../utils/constants";
import SpotlightCard from "./SpotlightCard/SpotlightCard";
import { useCartStore } from "../store/useCartStore";

const CartItem = ({ cartItem }: CartItemProps) => {
  const { removeFromCart,updateQuantity } = useCartStore();
  return (
    <SpotlightCard
      className="custom-spotlight-card w-full"
      spotlightColor="rgba(255, 0, 0, 0.10)"
    >
      <div className="flex flex-col sm:flex-row  sm:items-center sm:justify-center gap-2 justify-start">
        {/* image  */}
        <img
          src={getOptimizedImage(cartItem.images[0])}
          alt="product image"
          className="object-cover aspect-square   w-fit sm:w-auto h-20 rounded-full"
        />
        {/* title  and color  */}
        <div className="flex flex-col gap-1 h-full w-[40%]">
          <p className=" font-semibold  text-slate-200">{cartItem.title}</p>
          <p className="text-sm font-semibold text-gray-500">
            {cartItem.color}
          </p>
        </div>
        {/* price  */}
        <div className="flex flex-col sm:items-center font-semibold text-sm w-30 text-slate-400">
          Each
          <span className="text-red-600  sm:text-lg font-bold">
            ${cartItem.price}
          </span>
        </div>
        {/* quantity  */}
        <div className="flex gap-2 items-center px-2.5 py-0.5 border border-gray-400 rounded-md w-fit sm:w-auto">
          <button className="p-2 disabled:opacity-40   cursor-pointer" disabled={cartItem.quantity === 1} onClick={() => updateQuantity(cartItem._id,cartItem.quantity - 1)}>
            <Minus className="hover:text-gray-300 text-gray-300  "/>
          </button>
          <p className="font-semibold">{cartItem.quantity}</p>
          <button className="p-2 font-semibold"onClick={() => updateQuantity(cartItem._id,cartItem.quantity + 1)} >
            <Plus className="hover:text-gray-300 text-gray-300 d" />
          </button>
        </div>
        {/* total price  */}
        <div className="flex flex-col sm:items-center font-semibold text-sm text-slate-400 w-30">
          Total
          <span className="text-red-600 sm:text-lg font-bold">
            ${cartItem.price * cartItem.quantity}
          </span>
        </div>
        {/* remove button  */}
        <button
          onClick={() => removeFromCart(cartItem._id)}
          className="sm:ml-4 self-end sm:self-center"
        >
          <X className="hover:text-red-700 transition" />
        </button>
      </div>
    </SpotlightCard>
  );
};
export default CartItem;
