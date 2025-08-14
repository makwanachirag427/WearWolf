import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const handleAxiosError = (
  error: unknown,
  context: string = "Unexpected error occurred"
) => {
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || context;
    toast.error(errorMessage);
    console.log(context,error.message);
  }
};
