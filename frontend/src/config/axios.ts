import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/useAuthStore";

const apiBaseURL = import.meta.env.DEV
  ? "http://localhost:5001/api"
  : "https://wearwolf-backend.onrender.com/api";

// Create a reusable axios instance with default settings
const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiBaseURL, // All requests will start with this base URL
  withCredentials: true, // Send cookies with requests (needed for refresh token cookies)
});

// Extend the default AxiosRequestConfig to include our own `_retry` flag
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean; // This prevents infinite refresh loops
}

// Add a **response interceptor** to catch errors before they reach your code
axiosInstance.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  async (error: AxiosError) => {
    // Keep a reference to the original request config so we can retry it later
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Access Zustand's auth store (without using the hook in components)
    const authStore = useAuthStore.getState();

    // Debug log for visibility
    // console.log("[Interceptor] Error caught:", {
    //   url: originalRequest.url, // Which endpoint caused the error
    //   status: error.response?.status, // HTTP status code
    //   retry: originalRequest._retry, // Whether we already retried
    // });

    // Check if:
    // 1. The server says "Unauthorized" (401)
    // 2. We haven't retried this request yet
    // 3. It's NOT the refresh token request itself (avoid loops)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      // console.log("[Interceptor] Attempting refresh...");

      // Mark that we've already retried this request
      originalRequest._retry = true;

      try {
        // Call the refresh token endpoint to get a new access token
        await axios.post(`${apiBaseURL}/auth/refresh-token`, null, {
          withCredentials: true, // Send refresh token cookie
        });

        // console.log("[Interceptor] Refresh successful, retrying request...");

        // Retry the original failed request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        // If refresh fails (expired/invalid), log the user out
        // console.log("[Interceptor] Refresh failed:", refreshErr);
        authStore.logout();
        return Promise.reject(refreshErr); // Pass the error back to the caller
      }
    }

    // If the error isn't 401 or something else went wrong, just reject it
    return Promise.reject(error);
  }
);

export default axiosInstance;
