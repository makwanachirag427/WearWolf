import type { LucideIcon } from "lucide-react";

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  cartItems: string;
  address: Address;
}

export interface AuthStore {
  user: User | null;
  loading: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (formData: SignUpFormData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAddress: (formData: Address) => Promise<void>;
}

export interface NewProductForm {
  title: string;
  description: string;
  price: number;
  color: string;
  countInStock: number;
  category: string;
}

export interface Product extends NewProductForm {
  _id: string;
  isFeatured: boolean;
  sizes?: string[];
  images: string[];
  quantity: number;
}

export interface ProductFiltersType {
  category?: string;
  min?: number;
  max?: number;
  sort?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductStore {
  products: Product[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  getProducts: (filters: ProductFiltersType) => Promise<void>;
  getRecommendedProducts: () => Promise<void>;
  toggleFeaturedProducts: (id: string) => Promise<void>;
  createProduct: (formData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, formData: UpdateProductFormType) => Promise<void>;
}

export interface UpdateProductFormType {
  title: string;
  price: number;
  category: string;
  countInStock: number;
}

export interface EditProductModalProps {
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

export interface ProductCardProps {
  product: Product;
}
export interface ProductFiltersProps {
  filters: ProductFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<ProductFiltersType>>;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  expirationDate: Date;
  isActive: boolean;
  userId: string;
}

export interface CartStoreType {
  cartItems: Product[];
  total: number;
  subtotal: number;
  coupon: Coupon | null;
  isCouponApplied: boolean;
  getCoupon: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  getCartItems: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  calculateTotals: () => Promise<void>;
  clearCart: () => Promise<void>;
}

export interface CartItemProps {
  cartItem: Product;
}

export interface updateAddressFormType {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface updateAddressProps {
  setIsUpdatingAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AnalyticsDataType {
  users: number;
  products: number;
  totalSales: number;
  totalRevenue: number;
}

export interface DailySalesDataType {
  date: string;
  sales: number;
  revenue: number;
}

export interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}
