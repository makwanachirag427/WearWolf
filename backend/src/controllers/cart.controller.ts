import { Response } from "express";
import { RequestType } from "../types";
import { HandleError } from "../uitls/error";
import Product from "../models/product.model";

export const getCartProducts = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const cart = req.user!.cartItems;

    //Get list of product IDs
    const productIds = cart.map((item) => item.product);
    //fetch products from DB
    const products = await Product.find({ _id: { $in: productIds } });
    //Attach quantity to each product
    const cartItems = products.map((product) => {
      const item = cart.find(
        (cartItem) => cartItem.product.toString() === product._id.toString()
      );
      return {
        ...product.toObject(),
        quantity: item?.quantity ?? 1,
      };
    });

    res.status(200).json(cartItems);
  } catch (error) {
    HandleError(res, error, "getCartProducts controller");
  }
};

export const addToCart = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.body;
    const user = req.user!;

    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, quantity: 1 });
    }

    await user.save();
    res.status(200).json(user.cartItems);
  } catch (error) {
    HandleError(res, error, "addToCart controller");
  }
};

export const updateQuantity = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user!;

    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity = quantity;
      await user.save();
      res.status(200).json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    HandleError(res, error, "updateQuantity controller");
  }
};

export const removeAllFromCart = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.body;
    const user = req.user!;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== productId
      );
    }
    await user.save();
    res.status(200).json(user.cartItems);
  } catch (error) {
    HandleError(res, error, "removeAllFromCart controller");
  }
};
