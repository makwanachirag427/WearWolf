import { Response } from "express";
import { RequestType } from "../types";
import { HandleError } from "../uitls/error";
import Product from "../models/product.model";
import cloudinary from "../config/cloudinary";

export const getAllProducts = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  const { category } = req.query;
  try {
    const filter: any = {};

    if (category) {
      filter.category = category;
    }
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    HandleError(res, error, "getAllProducts controller");
  }
};

export const getProductById = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
  try {
  } catch (error) {
    HandleError(res, error, "getProductById controller");
  }
};

export const getFeaturedProducts = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    res.status(200).json(featuredProducts);
  } catch (error) {
    HandleError(res, error, "getFeaturedProducts controller");
  }
};

export const getRecommendedProducts = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const recommendedProducts = await Product.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          price: 1,
          images: 1,
        },
      },
    ]);

    res.status(200).json(recommendedProducts);
  } catch (error) {
    HandleError(res, error, "getRecommendedProducts controller");
  }
};

export const toggleFeaturedProducts = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      await product.save();
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    HandleError(res, error, "toggleFeaturedProducts controller");
  }
};

export const createProduct = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  const { title, description, price, color, category, sizes, countInStock } =
    req.body;
  try {
    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];

    for (const file of files) {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
          .end(file.buffer);
      });

      imageUrls.push(result.secure_url);
    }

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      color,
      sizes: JSON.parse(sizes),
      countInStock,
      images: imageUrls,
    });

    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (error) {
    HandleError(res, error, "createProduct controller");
  }
};

export const updateProduct = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, price, color, category, sizes, countInStock } =
      req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        color,
        category,
        sizes,
        countInStock,
      },
      { new: true }
    );

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    HandleError(res, error, "updateProduct controller");
  }
};

export const deleteProduct = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    if (product.images) {
      const imageUrls = product.images;

      const deletePromises = imageUrls.map(async (url) => {
        try {
          const publicId = url.split("/").pop()?.split(".")[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log(`deleted image from cloudinary`, publicId);
        } catch (error) {
          console.log("error deleting image from cloudinary", error);
        }
      });
      await Promise.all(deletePromises);
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    HandleError(res, error, "deleteProduct controller");
  }
};
