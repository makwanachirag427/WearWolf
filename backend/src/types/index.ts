import { Request } from "express";
import { Document, Types } from "mongoose";

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface UserType extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  address?: Address;
  cartItems: CartItem[];
}

export interface UserDocument extends UserType {
  comparePassword(password: string): Promise<void>;
}

export interface RequestType extends Request {
  user?: UserType;
}

export interface ProductDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes?: string[];
  color: string;
  countInStock: number;
  isFeatured: boolean;
}

export interface CouponDocument extends Document {
  code: string;
  discountPercentage: number;
  expirationDate: Date;
  isActive: boolean;
  userId: Types.ObjectId;
}

export interface OrderDocument extends Document {
  user: Types.ObjectId;
  products: { product: Types.ObjectId; quantity: number; price: number }[];
  totalAmount: number;
  stripeSessionId: string;
}

export interface ProductItem {
  id: string;
  quantity: number;
  price: number;
}

export type SessionMetadata = {
  userId: string;
  couponCode?: string;
  products: string;
};

export interface AnalyticsData {
  users: number;
  products: number;
  totalSales: number;
  totalRevenue: number;
}
