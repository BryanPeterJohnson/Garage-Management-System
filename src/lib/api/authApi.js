// src/lib/api/authApi.js
import axiosInstance from "./axiosInstance.js";

export const AuthApi = {
    login: async (username, password) => {
        const res = await axiosInstance.post("/auth/login", { username, password });
        return res.data; // { token, user }
    },

    setToken: (token) => {
        localStorage.setItem("token", token);
    },

    clearToken: () => {
        localStorage.clear();
    }

};
