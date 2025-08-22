import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import {type Product } from "../types";
import {getOptimizedImage } from "../utils/constants";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import EditProductModal from "./EditProductModal";

const ProductList = () => {
  const {
    products,
    toggleFeaturedProducts,
    deleteProduct,
    totalPages,
    getProducts,
  } = useProductStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
 

  useEffect(() => {
    getProducts({
      page,
      limit: 5,
    });
  }, [getProducts, page]);

  const handleDelete = async (id: string): Promise<void> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      background: "#1f2937", // Tailwind's gray-800
      color: "#f9fafb", // Tailwind's gray-50
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Tailwind's red-500
      cancelButtonColor: "#374151", // Tailwind's gray-700
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "rounded-lg shadow-lg",
        title: "text-lg font-semibold",
        confirmButton: "px-4 py-2 rounded",
        cancelButton: "px-4 py-2 rounded",
      },
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  

  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="h-full w-full  flex flex-col justify-center p-4 sm:p-4"
    >
      <div className="overflow-x-auto w-full max-w-6xl mx-auto">
        <table className="min-w-[600px] sm:min-w-full rounded-lg overflow-hidden">
          <thead className="bg-gray-600 text-gray-200 text-sm sm:text-base">
            <tr>
              <th className="p-2 border-b border-gray-700 text-left">
                PRODUCT
              </th>
              <th className="p-2 border-b border-gray-700 text-left">PRICE</th>
              <th className="p-2 border-b border-gray-700 text-left">
                CATEGORY
              </th>
              <th className="p-2 border-b border-gray-700 text-left">
                FEATURED
              </th>
              <th className="p-2 border-b border-gray-700 text-left">STOCK</th>
              <th className="p-2 border-b border-gray-700 text-left">STATUS</th>
              <th className="p-2 border-b border-gray-700 text-left">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 text-gray-300 font-semibold text-sm sm:text-base">
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-700">
                <td className="p-2 flex gap-2 items-center">
                  <img
                    src={getOptimizedImage(product.images[0])}
                    alt="product image"
                    className=" object-cover size-11 rounded-full"
                    loading="lazy"
                  />
                  <span>{product.title}</span>
                </td>
                <td className="p-2">${product.price}</td>
                <td className="p-2 ">
                  {product.category.toUpperCase()[0] +
                    product.category.slice(1)}
                </td>
                <td className="p-2 ">
                  <button
                    className=""
                    onClick={() => toggleFeaturedProducts(product._id)}
                  >
                    <Star
                      className={`${
                        product.isFeatured
                          ? "text-red-600 hover:text-gray-200"
                          : "text-gray-200"
                      }`}
                    />
                  </button>
                </td>
                <td className="p-2">{product.countInStock}</td>
                <td className="p-2">
                  {product.countInStock > 0 ? (
                    <span className="text-green-500 ">In stock</span>
                  ) : (
                    <span className="text-red-500">Out of stock</span>
                  )}
                </td>
                <td className="p-2">
                  <button
                    disabled={deletingId === product._id}
                    onClick={() => handleDelete(product._id)}
                    className="hover:text-red-600 transition-colors disabled:cursor-not-allowed items-center disabled:opacity-70"
                  >
                    Delete
                  </button>{" "}
                  <span className=" font-bold text-lg">|</span>
                  <button
                    onClick={() => handleEditClick(product)}
                    className="hover:text-blue-600 transition-colors ml-1"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 font-semibold hover:text-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft />
        </button>

        <span className="px-3 py-1 font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 hover:text-red-700 transition-all duration-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight />
        </button>
      </div>

      {/* modal */}
      {editingProduct && (
        <EditProductModal editingProduct={editingProduct} setEditingProduct={setEditingProduct}/>
      )}
    </motion.div>
  );
};
export default ProductList;
