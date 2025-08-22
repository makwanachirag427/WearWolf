import { useEffect, useState } from "react";
import type { Product } from "../types";
import { useParams } from "react-router-dom";
import { handleAxiosError } from "../utils/errorHandler";
import axios from "../config/axios";
import { getOptimizedImage } from "../utils/constants";
import { ShoppingCart, TriangleAlert } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const handleAddToCartButton = (product: Product) => {
    if (!user) {
      toast.info("Please log in to add items to your cart.");
    } else if (product.countInStock === 0) {
      toast.info(
        `Sorry, this item is unavailable. Try similar products in ${
          product.category.toUpperCase()[0] + product.category.slice(1)
        }.`
      );
    } else {
      addToCart(product);
    }
  };

  const { product_id } = useParams();

  useEffect(() => {
    const getProductById = async () => {
      try {
        const res = await axios.get(`/products/product/${product_id}`);
        setProduct(res.data);
      } catch (error) {
        handleAxiosError(error, "Error in getProductById");
      }
    };
    getProductById();
  }, [product_id]);

  return (
    <div className="pt-20 h-full w-full bg-black/20">
      <div className="h-full flex flex-col lg:flex-row gap-20 lg:gap-4 p-4">
        <div className="flex gap-4 lg:w-1/2 max-h-[80vh]">
          <div className="flex flex-col items-center justify-center gap-2 w-[30%]">
            {product?.images.map((image, index) => (
              <img
                key={index}
                src={getOptimizedImage(image)}
                className={`aspect-square size-25 object-cover border-2 p-0.5 rounded-md ${
                  currentIndex === index
                    ? " border-red-500"
                    : "border-slate-800"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <div className="flex w-full">
            <img
              src={product?.images[currentIndex]}
              className="image aspect-square   object-cover rounded-md"
              alt="preview"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-2 lg:w-1/2 lg:px-5 p-2 sm:p-8">
          <span className="px-4 py-0.5 w-fit  bg-blue-200 font-bold rounded-full  text-indigo-700">
            {product?.category &&
              product.category.toUpperCase()[0] + product.category.slice(1)}
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold">
            {product?.title}
          </h2>
          <p className="text-red-500 font-semibold text-xl sm:text-2xl">
            ${product?.price} only
          </p>
          {product?.countInStock === 0 ? (
            <p className="flex items-center gap-1 text-sm sm:text-base font-semibold text-red-500">
              Out of stock
            </p>
          ) : (
            product?.countInStock &&
            product.countInStock <= 5 && (
              <p className="flex items-center gap-1 text-sm sm:text-base font-semibold text-red-500">
                <TriangleAlert className="size-4 sm:size-5 text-red-500" />
                {`Hurry! only ${product?.countInStock} left`}
              </p>
            )
          )}
          <p className="text-gray-300 sm:text-base text-sm font-semibold ">
            Color : {product?.color}
          </p>
          <p className="text-gray-300 sm:text-base text-sm">
            {product?.description}
          </p>
          <button
            onClick={() => handleAddToCartButton(product!)}
            className="flex rounded-md justify-center gap-2 font-semibold items-center px-8 py-2 w-fit bg-red-700 hover:bg-red-800 mt-5"
          >
            <ShoppingCart /> Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
