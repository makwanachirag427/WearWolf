import { Response } from "express";
import { ProductItem, RequestType, SessionMetadata } from "../types";
import { HandleError } from "../uitls/error";
import Coupon from "../models/coupon.model";
import { stripe } from "../config/stripe";
import { ENVVARS } from "../uitls/envVars";
import Order from "../models/order.model";

const FRONTEND_URL = ENVVARS.CLIENT_URL;

export const createCheckoutSession = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      res.status(400).json({ message: "Invalid or empty product array" });
      return;
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); //stripe wants us to send amount in sent
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            images: product.images,
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        userId: req.user?._id.toString(),
        code: couponCode,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user?._id.toString() || "",
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    if (totalAmount >= 20000) {
      // console.log("Creating new coupon", req.user?._id.toString());
      await createNewCoupon(req.user!._id.toString());
    }

    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    HandleError(res, error, "createCheckoutSession controller");
  }
};

async function createStripeCoupon(discountPercentage: number) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupon(userId: string) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "WOLF" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
}

export const checkoutSuccess = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const metadata = session.metadata as SessionMetadata;

      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
      if (existingOrder) {
         res.status(200).json({
          success: true,
          message: "Order already exists for this session",
          orderId: existingOrder._id,
        });
        return;
      }

      if (metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: metadata.couponCode,
            userId: metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }

      const products: ProductItem[] = JSON.parse(metadata.products);

      const newOrder = new Order({
        user: metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total ? session.amount_total / 100 : 0, // convert from cents to dollers
        stripeSessionId: sessionId,
      });

      await newOrder.save();

      res.status(200).json({
        success: true,
        message: "Payment successful,order created,coupon deactivated if used.",
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    HandleError(res, error, "checkoutSuccess controller");
  }
};
