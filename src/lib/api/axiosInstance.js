// src/lib/api/axiosInstance.js
import axios from "axios";

// ✅ Use Vite env if available, fallback to localhost
const API_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000/api";

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10s timeout
    headers: {
        "Content-Type": "application/json",
    },
    // withCredentials: false, // enable only if backend sets cookies
});

// ✅ Attach token automatically from localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Global response/error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("API Error:", error.response.data);

            // Auto logout if unauthorized
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        } else if (error.request) {
            console.error("Network Error:", error.message);
        } else {
            console.error("Axios Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
