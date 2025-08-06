import mongoose, { Error } from "mongoose";
import { ENVVARS } from "../uitls/envVars";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(ENVVARS.MONGODB_URI);
    console.log(
      `Database connected successfully with host ${conn.connection.host}`
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error connecting with database`, error.message);
    }
    process.exit(1);
  }
};
