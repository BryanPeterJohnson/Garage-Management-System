// src/lib/api/bookingApi.js
import axios from "./axiosInstance.js";

export const BookingApi = {
    // --- List bookings with pagination + filters ---
    getBookings: async ({ status, page = 1, limit = 20, carRegNo, clientName, sortBy = "createdAt", sortDir = "desc" } = {}) => {
        try {
            const params = { status, page, limit, carRegNo, clientName, sortBy, sortDir };
            const res = await axios.get("/bookings", { params });
            const data = res.data || {};

            return {
                ok: data.success ?? true,
                items: data.data || [],
                totalItems: data.pagination?.total ?? (data.data?.length || 0),
                page: data.pagination?.page ?? 1,
                limit: data.pagination?.limit ?? limit,
                totalPages: data.pagination?.totalPages ?? 1,
            };
        } catch (err) {
            return { ok: false, error: err?.response?.data?.error || err.message || "Failed to fetch bookings" };
        }
    },

    // --- Get single booking ---
    getBookingById: async (id) => {
        try {
            const res = await axios.get(`/bookings/${id}`);
            const data = res.data || {};
            return { ok: true, booking: data.booking || data };
        } catch (err) {
            return { ok: false, error: err?.response?.data?.error || err.message || "Failed to fetch booking" };
        }
    },

    // --- Create booking ---
    createBooking: async (payload) => {
        try {
            const res = await axios.post("/bookings", payload);
            const data = res.data || {};
            return { ok: true, booking: data.booking || data };
        } catch (err) {
            return { ok: false, error: err?.response?.data?.error || err.message || "Failed to create booking" };
        }
    },

    // --- Update booking ---
    updateBooking: async (id, payload) => {
        try {
            const res = await axios.patch(`/bookings/${id}`, payload);
            const data = res.data || {};
            return { ok: true, booking: data.booking || data };
        } catch (err) {
            return { ok: false, error: err?.response?.data?.error || err.message || "Failed to update booking" };
        }
    },

    // --- Update booking status ---
    updateBookingStatus: async (id, status) => {
        try {
            if (!id || !status) throw new Error("Booking ID and status are required");
            console.log("Updating booking status:", { id, status });

            // Ensure status is string
            const payload = { status: String(status) };
            const res = await axios.patch(`/bookings/status/${id}`, payload);
            const data = res.data || {};

            console.log("Status update response:", data);
            return { ok: true, booking: data.booking || data };
        } catch (err) {
            console.error("Failed to update booking status:", err.response?.data || err.message);
            return { ok: false, error: err?.response?.data?.error || err.message || "Failed to update booking status" };
        }
    },

    // --- Delete booking ---
    deleteBooking: async (id) => {
        try {
            const res = await axios.delete(`/bookings/${id}`);
            return { ok: true, message: res.data?.message || "Booking deleted successfully" };
        } catch (err) {
            return { ok: false, error: err?.response?.data?.error || err.message || "Failed to delete booking" };
        }
    },
};
