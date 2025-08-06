import { Request } from "express";
import { Types } from "mongoose";

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
