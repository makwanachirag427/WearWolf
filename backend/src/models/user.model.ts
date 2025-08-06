import mongoose from "mongoose";
import { UserDocument } from "../types";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    address: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true }
);

// mongoose pre middleware which runs before the document is saved

userSchema.pre("save", async function (next) {
  // checks that password is modified or not after the document is updated
  if (!this.isModified("password")) return next();
  try {
    // generates the salt
    const salt = await bcrypt.genSalt(10);
    // hashes the password
    this.password = await bcrypt.hash(this.password, salt);
    //  passes the control to the next middleware
    next();
  } catch (error) {
    //throws an error and passes to the next middleware or route
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
