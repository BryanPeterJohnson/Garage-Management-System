// src/lib/api/UpsellApi.js
import axios from "./axiosInstance.js";

// ✅ Get all upsells
export async function getUpsells(params) {
    const res = await axios.get("/upsell", { params });
    return res.data;
}

// ✅ Get single upsell by ID
export async function getUpsellById(id) {
    const res = await axios.get(`/upsell/${id}`);
    return res.data;
}

// ✅ Get all upsells for a specific booking
export async function getUpsellsByBooking(bookingId) {
    const res = await axios.get(`/upsell/booking/${bookingId}`);
    return res.data;
}

// ✅ Create upsell for a booking
export async function createUpsell(bookingId, data) {
    const res = await axios.post(`/upsell/booking/${bookingId}`, data);
    return res.data;
}

// ✅ Update upsell
export async function updateUpsell(id, data) {
    const res = await axios.patch(`/upsell/${id}`, data);
    return res.data;
}

// ✅ Delete upsell
export async function deleteUpsell(id) {
    const res = await axios.delete(`/upsell/${id}`);
    return res.data;
}

// Export all together for easy import
export const UpsellApi = {
    getUpsells,
    getUpsellById,
    getUpsellsByBooking,
    createUpsell,
    updateUpsell,
    deleteUpsell,
};
