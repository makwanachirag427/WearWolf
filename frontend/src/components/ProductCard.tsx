import { ShoppingCart } from "lucide-react";
import type { ProductCardProps } from "../types";
import SpotlightCard from "./SpotlightCard/SpotlightCard";

const getOptimizedImage = (url: string) => {
  return url.replace("/upload/", "/upload/w_400,q_auto,f_auto/");
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <SpotlightCard
      className="custom-spotlight-card h-full w-full"
      spotlightColor="rgba(255, 0, 0, 0.20)"
    >
      <div className="flex flex-col cursor-pointer space-y-2">
        <div className="w-full aspect-square overflow-hidden rounded-md">
          <img
            src={getOptimizedImage(product.images[0])}
            alt="product image"
            className="object-cover  h-full w-full"
          />
        </div>

        <p className="font-semibold text-lg">{product.title}</p>
        <div className="flex items-center justify-between">
          <p className="font-bold text-xl text-red-600">${product.price}</p>
          {product.countInStock === 0 && (
            <span className="text-red-700 font-bold">Out of stock</span>
          )}
        </div>
        <button className="flex rounded-md justify-center gap-2 font-semibold text-sm items-center px-4 py-2 w-fit bg-red-600 hover:bg-red-700">
          <ShoppingCart /> Add to cart
        </button>
        {product.sizes!.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center text-gray-500">
            <h3 className="text-sm">Available sizes :</h3>
            {product.sizes!.map((size,index) => (
              <p className="text-sm font-bold " key={index}>{size}</p>
            ))}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
};
export default ProductCard;
