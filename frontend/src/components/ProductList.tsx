import { useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { LoaderCircle, Star } from "lucide-react";
import { type UpdateProduct, type Product } from "../types";
import { categories } from "../utils/constants";

const ProductList = () => {
  const {
    loading,
    products,
    toggleFeaturedProducts,
    deleteProduct,
    updateProduct,
  } = useProductStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<UpdateProduct>({
    title: "",
    price: 0,
    category: "",
    countInStock: 0,
  });

  const handleDelete = async (id: string): Promise<void> => {
    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      countInStock: product.countInStock,
    });
  };

  const handleSave = async () => {
    await updateProduct(editingProduct!._id, formData);
    setEditingProduct(null);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (loading) return;
    if (e.target === e.currentTarget) {
      setEditingProduct(null); // close if clicking outside modal
    }
  };

  return (
    <div className="h-full w-full  flex justify-center p-4 sm:p-8">
      <div className="overflow-x-auto w-full max-w-6xl">
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
                    src={product.images[0]}
                    alt="product image"
                    className=" object-cover size-11 rounded-full"
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
      {/* modal */}
      {editingProduct && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="bg-950 rounded-lg border bg-neutral-950/85 shadow-lg p-6 lg:p-10 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Update Product</h2>

            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
              required
            />

            <label htmlFor="price" className="block mb-2 text-sm font-medium">
              Price
            </label>
            <input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  price:
                    value === "" ? ("" as unknown as number) : Number(value),
                });
              }}
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
              required
            />

            <label
              htmlFor="category"
              className="block mb-2 text-sm font-medium"
            >
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="
                  w-full  border border-white text-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950
                  appearance-none
                  cursor-pointer mb-2 
                "
            >
              <option value={""} hidden>
                Choose category
              </option>
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="text-white bg-neutral-950"
                >
                  {cat.toUpperCase()[0] + cat.slice(1)}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium">
              Count in Stock
            </label>
            <input
              type="number"
              value={formData.countInStock}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  countInStock:
                    value === "" ? ("" as unknown as number) : Number(value),
                });
              }}
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-300 font-semibold disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-red-600 font-semibold text-white rounded-lg hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default ProductList;
