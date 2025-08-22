import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import axios from "../config/axios";
import { ArrowRight, CircleCheckBig, HandHeart, Loader } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard/SpotlightCard";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    const handlePaymentSuccess = async (sessionId: string) => {
      try {
        const res = await axios.post("/payments/checkout-success", {
          sessionId,
        });
        setOrderId(res.data.orderId.toString());
        clearCart();
        // Remove session_id from URL so refresh won't trigger again
        const url = new URL(window.location.href);
        url.searchParams.delete("session_id");
        window.history.replaceState({}, document.title, url.pathname);
      } catch (error) {
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId) {
      handlePaymentSuccess(sessionId);

    } else {
      setError("No session ID found in the URL");
    }
  }, [clearCart]);

  if (isProcessing)
    return (
      <div className="flex justify-center items-center mt-50">
        <Loader className="animate-spin text-white size-10" />
      </div>
    );
  if (error) {
    return (
      <div className="flex justify-center items-center mt-50">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-20 h-full flex justify-center items-center p-2.5 sm:p-0">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99,
          pointerEvents: "none",
        }}
        numberOfPieces={700}
        recycle={false}
      />
      <SpotlightCard
        className="custom-spotlight-card max-w-md w-full "
        spotlightColor="rgba(255, 0, 0, 0.10)"
      >
        <div className="flex flex-col justify-center items-center space-y-4 p-2 sm:p-4">
          <CircleCheckBig className="size-15 text-green-600" />
          <h2 className="text-3xl text-center text-green-600 font-bold">
            Purchase Successful!
          </h2>
          <p className="text-center text-gray-300">
            Thank you for your order. We're processing it now.
          </p>
          <div className="flex flex-col gap-2 bg-gray-700/30 text-center text-gray-400 rounded-md p-4 w-full">
            <p className="flex justify-between w-full text-sm">
              <span className="font-semibold">Order Id</span>
              <span className="text-green-500">{orderId}</span>
            </p>
            <p className="flex justify-between w-full text-sm">
              <span className="font-semibold">Estimated delivery</span>
              <span className="text-green-500">3-5 business days</span>
            </p>
          </div>
          <div className="flex gap-2 rounded-md w-full bg-green-700 py-2 justify-center  font-semibold items-center hover:bg-green-800 transition-all duration-400">
            <HandHeart className="size-5 mt-0.5" />
            Thanks for trusting us!
          </div>
          <Link
            to={"/"}
            className="flex gap-2 rounded-md w-full bg-gray-700/30 py-2  justify-center  font-semibold items-center text-green-500 hover:bg-gray-700/50 transition-all duration-400"
          >
            Continue shopping
            <ArrowRight className="size-5 mt-0.5" />
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
};
export default PurchaseSuccessPage;
