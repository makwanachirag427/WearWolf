import { Response } from "express";
import { RequestType } from "../types";
import { HandleError } from "../uitls/error";
import User from "../models/user.model";

export const updateAddress = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  const user = req.user?._id;
  const { fullName, phone, street, city, state, postalCode, country } =
    req.body;

  if (
    !fullName ||
    !phone ||
    !street ||
    !city ||
    !state ||
    !postalCode ||
    !country
  ) {
    res.status(400).json({ message: "All address fields are required" });
    return;
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        address: {
          fullName,
          phone,
          street,
          city,
          state,
          postalCode,
          country,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res
      .status(200)
      .json({
        message: "Address updated successfully",
        address: updatedUser.address,
      });
  } catch (error) {
    HandleError(res, error, "updateAddress controller");
  }
};


