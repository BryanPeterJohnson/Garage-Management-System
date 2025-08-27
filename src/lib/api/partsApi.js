// src/lib/api/partsApi.js
import axios from "./axiosInstance.js";

// ✅ Get all parts
export async function getParts(params) {
    const res = await axios.get("/parts", { params });
    return res.data;
}

// ✅ Get single part by ID
export async function getPartById(id) {
    const res = await axios.get(`/parts/${id}`);
    return res.data;
}

// ✅ Create part
export async function createPart(data) {
    const res = await axios.post("/parts", data);
    return res.data;
}

// ✅ Update part
export async function updatePart(id, data) {
    const res = await axios.patch(`/parts/${id}`, data);
    return res.data;
}

// ✅ Delete part
export async function deletePart(id) {
    const res = await axios.delete(`/parts/${id}`);
    return res.data;
}
