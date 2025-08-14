import { ArrowBigDown, Image, Loader, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { NewProductForm } from "../types";
import { motion } from "framer-motion";
import { useProductStore } from "../store/useProductStore";
import { toast } from "react-toastify";
import { categories, sizesOptions } from "../utils/constants";



const CreateProductForm = () => {
  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newProductForm, setNewProductForm] = useState<NewProductForm>({
    title: "",
    description: "",
    price: 0,
    color: "",
    countInStock: 0,
    category: "",
  });

  const handleFileChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);

    // reset the input so same file can be selected again
    e.target.value = "";
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setNewProductForm({ ...newProductForm, [e.target.name]: e.target.value });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = null; //remove image
    setImages(updatedImages);
  };

  const handleReset = () => {
    setNewProductForm({
      title: "",
      description: "",
      price: 0,
      color: "",
      countInStock: 0,
      category: "",
    });
    setImages([null, null, null, null]);
    setSizes([]);
  };

  const { createProduct, loading } = useProductStore();

  const validateForm = () => {
    if (!images.some((img) => img !== null))
      return toast.error("Please upload at least one image");
    if (!newProductForm.title.trim())
      return toast.error("Please enter product name.");
    if (newProductForm.price <= 0)
      return toast.error("Please enter a valid price.");
    if (!newProductForm.description.trim())
      return toast.error("Please enter product description.");
    if (!newProductForm.color.trim())
      return toast.error("Please enter a color.");
    if (!newProductForm.category.trim())
      return toast.error("Please select a category.");

    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = validateForm();
    if (success !== true) return;

    const formData = new FormData();
    formData.append("title", newProductForm.title);
    formData.append("description", newProductForm.description);
    formData.append("price", newProductForm.price.toString());
    formData.append("color", newProductForm.color);
    formData.append("countInStock", newProductForm.countInStock.toString());
    formData.append("category", newProductForm.category);
    formData.append("sizes", JSON.stringify(sizes));

    images
      .filter((file): file is File => file instanceof File)
      .forEach((file) => formData.append("images", file));

    for (const [key, value] of formData.entries()) {
      console.log(key, ":", value);
    }

    createProduct(formData);
    handleReset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 200 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="h-full w-full px-8 pb-10 lg:px-0"
    >
      <form
        onSubmit={handleSubmit}
        className="h-full w-full flex flex-col gap-8 sm:max-w-4xl p-2 sm:p-8 sm:mx-auto sm:border-2  sm:rounded-xl"
      >
        {/* image upolad  */}
        <div className="flex flex-col gap-5">
          <h2 className="text-base sm:text-lg font-semibold flex gap-1 items-center">
            Click image icons to upload product images
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">required</span>
            <ArrowBigDown className="animate-bounce size-8" />
          </h2>
          {images.map((file, index) => (
            <div key={index} className="flex items-center gap-4 cursor-pointer">
              <label className="flex gap-4">
                {/* image icon  */}
                <Image
                  className={`size-10 sm:size-20  ${
                    file ? "text-red-600" : "text-slate-200"
                  }`}
                  strokeWidth={0.8}
                />
                {/* hidden input for upload  */}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFileChange(index, e)}
                />
              </label>
              {/* image preview  */}
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="size-20 object-cover"
                />
              )}
              {/* file name  */}
              <span className="text-xs sm:text-sm  font-semibold text-slate-200 flex-1">
                {file ? file.name : "No file chosen"}
              </span>
              {/* delete button  */}
              {file && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveImage(index);
                  }}
                  className="hover:text-red-500 p-2"
                >
                  <X />
                </button>
              )}
            </div>
          ))}
        </div>
        {/* product info */}
        <div className="flex flex-col gap-8">
          <h2 className="text-base sm:text-lg font-semibold flex gap-3 items-center">
            Enter Product details below{" "}
            <ArrowBigDown className="animate-bounce" />{" "}
          </h2>
          <div className="flex flex-col gap-10  w-full">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Product Name  */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="title" className="font-semibold">
                  Name
                  <span aria-hidden="true" className="text-red-500">
                    *
                  </span>
                  <span className="sr-only">required</span> :
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newProductForm.title}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="display flex  items-center border px-4 py-2 rounded-lg  gap-3  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950 text-gray-100 outline-none placeholder:text-gray-500"
                />
              </div>
              {/* Product Price  */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="price" className="font-semibold">
                  Price ( $ )
                  <span aria-hidden="true" className="text-red-500">
                    *
                  </span>
                  <span className="sr-only">required</span> :
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newProductForm.price}
                  onChange={handleInputChange}
                  placeholder="Enter product price"
                  min={0}
                  className="display flex  items-center border px-4 py-2 rounded-lg   gap-3  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950 text-gray-100 outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Product description  */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="description">
                Description
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
                <span className="sr-only">required</span> :
              </label>
              <textarea
                name="description"
                id="description"
                value={newProductForm.description}
                onChange={handleInputChange}
                placeholder="Enter product description..."
                className="flex items-start border px-4 py-3 rounded-lg gap-3 
               focus:ring-2 focus:ring-red-600 focus:ring-offset-2 
                focus:ring-offset-neutral-950 text-gray-100  bg-transparent outline-none w-full placeholder:text-gray-500 resize-none min-h-[120px] leading-relaxed"
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-8  gap-4">
              {/* Product color  */}
              <div className="flex flex-col gap-2 w-full lg:w-100 ">
                <label htmlFor="color" className="font-semibold">
                  Color
                  <span aria-hidden="true" className="text-red-500">
                    *
                  </span>
                  <span className="sr-only">required</span> :
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={newProductForm.color}
                  onChange={handleInputChange}
                  placeholder="Enter product color"
                  className="display flex  items-center border px-4 py-2 rounded-lg  gap-3  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950 text-gray-100 outline-none placeholder:text-gray-500"
                />
              </div>
              {/* Product Sizes  */}
              <div className="flex flex-col gap-2">
                <label htmlFor="sizes" className="font-semibold text-gray-200">
                  Product sizes (Optional):
                </label>

                <div className="flex flex-wrap gap-3">
                  {sizesOptions.map((size) => (
                    <label key={size} className=" flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={size}
                        checked={sizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSizes([...sizes, size]);
                          } else {
                            setSizes(sizes.filter((s) => s !== size));
                          }
                        }}
                        className="accent-red-600 sm:size-5"
                      />
                      {size}
                    </label>
                  ))}
                </div>

                <p className="text-sm text-gray-400">
                  Selected : {sizes.join(", ") || "None"}
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:gap-8 gap-4">
              {/* Product stock  */}
              <div className="flex flex-col gap-2 w-full lg:w-100 ">
                <label htmlFor="countInStock" className="font-semibold">
                  Stock(Optional) :
                </label>
                <input
                  type="number"
                  id="countInStock"
                  name="countInStock"
                  min={0}
                  value={newProductForm.countInStock}
                  onChange={handleInputChange}
                  placeholder="Enter product stock"
                  className="display flex  items-center border px-4 py-2 rounded-lg  gap-3  focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-neutral-950 text-gray-100 outline-none placeholder:text-gray-500"
                />
              </div>
              {/* Product Category  */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="category"
                  className="font-semibold text-gray-200"
                >
                  Category
                  <span aria-hidden="true" className="text-red-500">
                    *
                  </span>
                  <span className="sr-only">required</span> :
                </label>

                <select
                  id="category"
                  name="category"
                  value={newProductForm.category}
                  onChange={handleInputChange}
                  className="
      w-full bg-neutral-950 border border-white text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950
      appearance-none
      cursor-pointer
    "
                >
                  <option value={""} hidden>
                    Choose category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="text-white">
                      {cat.toUpperCase()[0] + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* action buttons  */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4  sm:gap-5 sm:mt-5">
          <button
            type="submit"
            className="flex items-center gap-2 w-30 justify-center py-2
             font-semibold text-white bg-red-600 
             rounded-lg  transition-all duration-300 ease-in-out
             hover:bg-red-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin stroke-3" /> : "Submit"}
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="flex items-center gap-2  w-30  justify-center py-2
             font-semibold text-black bg-white 
             rounded-lg  transition-all duration-300 ease-in-out
             hover:opacity-90 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
};
export default CreateProductForm;
