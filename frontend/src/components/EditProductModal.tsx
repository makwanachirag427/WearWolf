import { LoaderCircle } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import type { EditProductModalProps, UpdateProductFormType } from "../types";
import { useState } from "react";
import { categories } from "../utils/constants";

const EditProductModal = ({
  editingProduct,
  setEditingProduct,
}: EditProductModalProps) => {
  const { loading, updateProduct } = useProductStore();
  const [formData, setFormData] = useState<UpdateProductFormType>({
    title: editingProduct!.title,
    price: editingProduct!.price,
    category: editingProduct!.category,
    countInStock: editingProduct!.countInStock,
  });

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
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              price: value === "" ? ("" as unknown as number) : Number(value),
            });
          }}
          className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950"
          required
        />

        <label htmlFor="category" className="block mb-2 text-sm font-medium">
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
            <option key={cat} value={cat} className="text-white bg-neutral-950">
              {cat.toUpperCase()[0] + cat.slice(1)}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-sm font-medium">Count in Stock</label>
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
  );
};
export default EditProductModal;
