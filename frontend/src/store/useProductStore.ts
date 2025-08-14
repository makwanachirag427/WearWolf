import { create } from "zustand";
import { type ProductStore } from "../types";
import axios from "../config/axios";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/errorHandler";

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  getProducts: async (category) => {
    set({ loading: true });
    try {
      const query = category ? `?category=${encodeURIComponent(category)}` : "";
      const res = await axios.get(`/products${query}`);
      set({ products: res.data });
    } catch (error) {
      handleAxiosError(error, "Error in get getProducts method");
    } finally {
      set({ loading: false });
    }
  },
  getProductById: async (id) => {},
  getFeaturedProducts: async () => {},
  getRecommendedProducts: async () => {},
  toggleFeaturedProducts: async (id) => {
    try {
      await axios.patch(`/products/featured/${id}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: !product.isFeatured }
            : { ...product }
        ),
      }));
    } catch (error) {
      handleAxiosError(error, "error in toggleFeaturedProducts");
    }
  },
  createProduct: async (formData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products/create", formData);
      console.log(res.data);
      toast.success("product created successfully");
    } catch (error) {
      handleAxiosError(error, "Error in createProduct method");
    } finally {
      set({ loading: false });
    }
  },
  deleteProduct: async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== id),
      }));
      toast.success("Product deleted successfully.");
    } catch (error) {
      handleAxiosError(error, "Error in delete Product");
    }
  },
  updateProduct: async (id, formData) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${id}`, formData);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id ? res.data : product
        ),
      }));
      toast.success("Product updated successfully");
    } catch (error) {
      handleAxiosError(error, "Error in updateProduct method");
    } finally {
      set({ loading: false });
    }
  },
}));
