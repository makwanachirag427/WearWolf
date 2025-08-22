import { create } from "zustand";
import { type ProductStore } from "../types";
import axios from "../config/axios";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/errorHandler";

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  totalPages: 1,
  currentPage: 1,
  getProducts: async (filters = {}) => {
    set({ loading: true });
    try {
      const res = await axios.get("/products", {
        params: {
          ...(filters.category && { category: filters.category }),
          ...(filters.min !== undefined && { min: filters.min }),
          ...(filters.max !== undefined && { max: filters.max }),
          ...(filters.sort && { sort: filters.sort }),
          ...(filters.featured !== undefined && { featured: filters.featured }),
          ...(filters.page && { page: filters.page }),
          ...(filters.limit && { limit: filters.limit }),
        },
      });
      set({
        products: res.data.products,
        currentPage: res.data.currentPage ?? 1,
        totalPages: res.data.totalPages ?? 1,
      });
    } catch (error) {
      handleAxiosError(error, "Error in  getProducts method");
    } finally {
      set({ loading: false });
    }
  },
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
      await axios.post("/products/create", formData);
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
