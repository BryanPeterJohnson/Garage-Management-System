// src/lib/api/partsApi.js
import axiosInstance from "./axiosInstance.js";

// ✅ Get all parts (with optional filters/pagination)
export async function getParts(params = {}) {
    const { data } = await axiosInstance.get("/parts", { params });
    return data;
}

// ✅ Get a single part by ID
export async function getPartById(id) {
    if (!id) throw new Error("❌ getPartById: ID is required");
    const { data } = await axiosInstance.get(`/parts/${id}`);
    return data;
}

// ✅ Create a new part
export async function createPart(payload) {
    if (!payload) throw new Error("❌ createPart: payload is required");
    const { data } = await axiosInstance.post("/parts", payload);
    return data;
}

// ✅ Update an existing part
export async function updatePart(id, payload) {
    if (!id) throw new Error("❌ updatePart: ID is required");
    const { data } = await axiosInstance.patch(`/parts/${id}`, payload);
    return data;
}

// ✅ Delete part
export async function deletePart(id) {
    if (!id) throw new Error("❌ deletePart: ID is required");
    const { data } = await axiosInstance.delete(`/parts/${id}`);
    return data;
}
