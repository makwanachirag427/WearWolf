import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCartPage = () => {
  return (
    <div className="h-full bg-black/20">
      <div className="flex flex-col gap-3 text-center justify-center items-center h-full">
        <ShoppingCart className="size-25 text-slate-200" />
        <h2 className="font-semibold text-2xl text-slate-200">Your cart is empty</h2>
        <p className="text-slate-400 max-w-md">
          Your shopping cart is empty. Explore our latest collection and add
          items you love!
        </p>
        <Link to={"/"} className="text-base font-semibold bg-red-600 hover:bg-red-700 w-fit px-8 py-2 rounded-md cursor-pointer transition-all duration-300">
          Start Shopping
        </Link>
      </div>
    </div>
  );
};
export default EmptyCartPage;
