import axios from "./axiosInstance.js";

// ✅ Get all upsells
export async function getUpsells(params) {
    const res = await axios.get("/upsells", { params });
    return res.data;
}

// ✅ Get single upsell by ID
export async function getUpsellById(id) {
    const res = await axios.get(`/upsells/${id}`);
    return res.data;
}

// ✅ Create upsell
export async function createUpsell(data) {
    const res = await axios.post("/upsells", data);
    return res.data;
}

// ✅ Update upsell
export async function updateUpsell(id, data) {
    const res = await axios.patch(`/upsells/${id}`, data);
    return res.data;
}

// ✅ Delete upsell
export async function deleteUpsell(id) {
    const res = await axios.delete(`/upsells/${id}`);
    return res.data;
}
