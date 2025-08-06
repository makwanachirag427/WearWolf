import { Response } from "express";

export const HandleError = (
  res: Response,
  error: unknown,
  context: string,
  status: number = 500
) => {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown Error occurred";
  console.log(`Error in ${context}`, errorMessage);
  res.status(status).json({
    message: errorMessage,
  });
};
