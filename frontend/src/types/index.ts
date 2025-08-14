export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  cartItems: string;
}

export interface AuthStore {
  user: User | null;
  loading: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (formData: SignUpFormData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
}

export interface ProductStore {
  products: Product[];
  loading: boolean;
  getProducts: (category?: string) => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  getFeaturedProducts: () => Promise<void>;
  getRecommendedProducts: () => Promise<void>;
  toggleFeaturedProducts: (id: string) => Promise<void>;
  createProduct: (formData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, formData: UpdateProduct) => Promise<void>;
}

export interface UpdateProduct {
  title: string;
  price: number;
  category: string;
  countInStock: number;
}
