import axios from "./axiosInstance.js";

export async function getBookings(params) {
    const res = await axios.get("/bookings", { params });
    return res.data;
}

export async function getBookingById(id) {
    const res = await axios.get(`/bookings/${id}`);
    return res.data;
}

export async function createBooking(data) {
    const res = await axios.post("/bookings", data);
    return res.data;
}

export async function updateBooking(id, data) {
    const res = await axios.patch(`/bookings/${id}`, data);
    return res.data;
}

export async function updateBookingStatus(id, action) {
    try {
        const res = await axios.patch(`/bookings/status/${id}`, { action });
        return res.data;
    } catch (err) {
        // Extract backend error message
        if (err.response && err.response.data) {
            throw new Error(err.response.data.error || JSON.stringify(err.response.data));
        }
        throw err;
    }
}
