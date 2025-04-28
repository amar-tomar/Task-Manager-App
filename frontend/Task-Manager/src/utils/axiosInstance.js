import axios from "axios";
import { API_BASE_URL} from "./apiPaths"
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Redirect to Login page
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server Error. Please Try again later...");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout.Please try again.");
    }
    return Promise.reject(error);
  }
);
export default axiosInstance
