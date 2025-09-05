// src/lib/api/serviceApi.js
import axiosInstance from "./axiosInstance.js";

// ✅ Get all services
export async function getServices(params = {}) {
    const { data } = await axiosInstance.get("/service", { params });
    return data;
}

// ✅ Create a new service
export async function createService(payload) {
    if (!payload) throw new Error("❌ createService: payload is required");
    const { data } = await axiosInstance.post("/service", payload);
    return data;
}

// ✅ Update an existing service
export async function updateService(id, payload) {
    if (!id) throw new Error("❌ updateService: ID is required");
    const { data } = await axiosInstance.patch(`/service/${id}`, payload);
    return data;
}

// ✅ Delete a service
export async function deleteService(id) {
    if (!id) throw new Error("❌ deleteService: ID is required");
    const { data } = await axiosInstance.delete(`/service/${id}`);
    return data;
}
