import { create } from "zustand";
import { type AuthStore } from "../types";
import { handleAxiosError } from "../utils/errorHandler";
import { toast } from "react-toastify";
import axios from "../config/axios";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data });
    } catch (error) {
      set({ user: null });
      console.error("error while authCheck", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data });
      toast.success("User created successfully.");
    } catch (error) {
      handleAxiosError(error, "Error while creating user");
    } finally {
      set({ loading: false });
    }
  },
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data });
      toast.success("Logged in successfully.");
    } catch (error) {
      handleAxiosError(error, "Error while login");
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      handleAxiosError(error, "Error while logout");
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  updateAddress: async (formData) => {
    set({ loading: true });
    try {
      const res = await axios.patch("/user/address",  formData );
      set((prevState) => ({
        user: { ...prevState.user!, address: res.data.address },
      }));
      toast.success("Address updated/added successfully");
    } catch (error) {
      handleAxiosError(error, "Error in updateAddress");
    } finally {
      set({ loading: false });
    }
  },
}));
