import { create } from "zustand";
import { type CartStoreType } from "../types";
import axios from "../config/axios";
import { handleAxiosError } from "../utils/errorHandler";
import { toast } from "react-toastify";

export const useCartStore = create<CartStoreType>((set, get) => ({
  cartItems: [],
  total: 0,
  subtotal: 0,
  coupon: null,
  isCouponApplied: false,
  getCoupon: async () => {
    try {
      const res = await axios.get("/coupons");
      set({ coupon: res.data });
    } catch (error) {
      handleAxiosError(error, "Error in getCoupon method");
    }
  },
  applyCoupon: async (code) => {
    try {
      const res = await axios.post("/coupons/validate", { code });
      set({ coupon: res.data, isCouponApplied: true });
      get().calculateTotals();
    } catch (error) {
      handleAxiosError(error, "Error in applyCoupon method");
    }
  },
  removeCoupon: async () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },
  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cartItems: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cartItems: [] });
      handleAxiosError(error, "Error in getCartItems method");
    }
  },
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart successfully");
      set((prevState) => {
        const existingItem = prevState.cartItems.find(
          (item) => item._id === product._id
        );

        const newCartItems = existingItem
          ? prevState.cartItems.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cartItems, { ...product, quantity: 1 }];

        return { cartItems: newCartItems };
      });
      get().calculateTotals();
    } catch (error) {
      handleAxiosError(error, "Error in addToCart method");
    }
  },
  removeFromCart: async (productId) => {
    try {
      await axios.delete("/cart", { data: { productId } });
      set((prevState) => ({
        cartItems: prevState.cartItems.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (error) {
      handleAxiosError(error, "Error in removeFromCart method");
    }
  },
  updateQuantity: async (productId, quantity) => {
    try {
      await axios.patch(`/cart/${productId}`, { quantity });
      set((prevState) => ({
        cartItems: prevState.cartItems.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
      get().calculateTotals();
    } catch (error) {
      handleAxiosError(error, "error in updaeQuantity controller");
    }
  },
  calculateTotals: async () => {
    const { cartItems, coupon } = get();

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
  clearCart: async () => {
    set({ coupon: null, total: 0, subtotal: 0, cartItems: [] });
  },
}));
