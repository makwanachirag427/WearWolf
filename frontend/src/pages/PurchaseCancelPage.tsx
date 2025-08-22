import { ArrowLeft, CircleX } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard/SpotlightCard";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div className="pt-20 h-full flex justify-center items-center p-2.5 sm:p-0">
      <SpotlightCard
        className="custom-spotlight-card max-w-md w-full "
        spotlightColor="rgba(255, 0, 0, 0.10)"
      >
        <div className="flex flex-col justify-center items-center space-y-4 p-2 sm:p-4">
          <CircleX className="size-15 text-red-600" />
          <h2 className="text-3xl text-center text-red-600 font-bold">
            Purchase Cancelled
          </h2>
          <p className="text-center text-gray-300">Your order has been cancelled. No charges have been made.</p>
          <p className="bg-gray-700/30 text-center text-gray-400 rounded-md p-4">If you encountered any issues during the checkout process, please don't hesitate to contact our support team.</p>
          <Link to={"/"} className="flex gap-2 rounded-md w-full bg-gray-700/30 py-3 justify-center  font-semibold items-center text-slate-400 hover:bg-gray-700/50 transition-all duration-400">
           <ArrowLeft className="size-5 mt-0.5"/>
           Return to shop
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
};
export default PurchaseCancelPage;
