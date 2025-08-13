// app/src/lib/api.js

// This value comes from .env via Webpack DefinePlugin.
// Fallback keeps dev working even if env isn't wired.
const API_BASE = process.env.API_BASE || "http://127.0.0.1:5000/api";

const TOKEN_KEY = "gms_token";

/* ---------------- Token helpers ---------------- */
export function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

/* ---------------- Core request wrapper ---------------- */
async function request(path, { method = "GET", body, headers = {}, signal } = {}) {
    const token = getToken();

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body != null ? JSON.stringify(body) : undefined,
        signal,
    });

    let data = null;
    try { data = await res.json(); } catch { /* 204/empty body is fine */ }

    if (!res.ok) {
        const msg = data?.error || data?.message || `${res.status} ${res.statusText}`;
        if (res.status === 401) {
            // token invalid/expired — clear so UI can redirect to login
            clearToken();
        }
        throw new Error(msg);
    }

    return data ?? {};
}

/* ---------------- Auth ---------------- */
export async function apiLogin(username, password) {
    const data = await request("/auth/login", {
        method: "POST",
        body: { username, password },
    });
    if (data?.token) setToken(data.token); // persist for subsequent calls
    return data; // { token, user: { id, username, userType } }
}

/* ---------------- Bookings ---------------- */

// List bookings with optional filters: { status, regNo, from, to, page, limit, sort }
export function apiGetBookings(params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v) !== "") qs.append(k, v);
    });
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return request(`/bookings${query}`);
}

// Get single booking
export const apiGetBooking = (id) => request(`/bookings/${id}`);

// Create pre-booking (payload should match backend fields)
export const apiCreateBooking = (payload) =>
    request("/bookings", { method: "POST", body: payload });

// Update editable fields of a booking (PATCH /api/bookings/:id)
export const apiUpdateBooking = (id, payload) =>
    request(`/bookings/${id}`, { method: "PATCH", body: payload });

// Change status: action is one of 'confirm' | 'arrive' | 'complete' | 'cancel'
export const apiChangeBookingStatus = (id, action) =>
    request(`/bookings/${id}/status`, { method: "PATCH", body: { action } });

// (Optional) export base for debugging
export { API_BASE };
