const API_BASE = "http://192.168.18.99:5000/api";
const TOKEN_KEY = "gms_token";

// ===== TOKEN MANAGEMENT =====
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ===== GENERIC API REQUEST HELPER =====
async function apiRequest(endpoint, method = "GET", body = null, auth = true) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (!token) {
      console.error("❌ No token found in localStorage. Please login first.");
      throw new Error("No authentication token found.");
    }
    console.log(`🔑 Using token: ${token}`);
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
  console.log(`🌍 Request: ${method} ${url}`);

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty or invalid JSON
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || `${res.status} ${res.statusText}`;
    if (res.status === 401) {
      console.warn("⚠️ Unauthorized. Clearing token.");
      clearToken();
    }
    throw new Error(msg);
  }

  return data ?? {};
}

// ===== AUTH =====
export async function apiLogin(username, password) {
  const data = await apiRequest("/auth/login", "POST", { username, password }, false);
  if (data?.token) setToken(data.token);
  return data;
}

export async function apiLogout() {
  clearToken();
}

// ===== BOOKINGS =====
export async function getAllBookings(params = {}) {
  const query = {
    page: params.page ?? 1,
    limit: params.limit ?? 1000,
    ...params
  };
  Object.keys(query).forEach(key => {
    if (query[key] === undefined || query[key] === null) {
      delete query[key];
    }
  });
  const qs = new URLSearchParams(query).toString();
  return apiRequest(`/bookings?${qs}`, "GET");
}

export async function getArrivedBookings(params = {}) {
  const qs = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 1000,
    ...params
  });
  return apiRequest(`/bookings/status/arrived?${qs.toString()}`, "GET");
}

export async function createBooking(data) {
  return apiRequest("/bookings", "POST", data);
}

export async function updateBookingStatus(bookingId, action) {
  return apiRequest(`/bookings/${bookingId}/status`, "PATCH", { action });
}

// ===== DASHBOARD =====
export async function getDashboardStats() {
  return apiRequest("/dashboard", "GET");
}

// ===== SERVICES =====
export async function getServices() {
  return apiRequest("/services", "GET");
}

export async function addService(data) {
  return apiRequest("/services", "POST", data);
}

export async function updateService(id, data) {
  return apiRequest(`/services/${id}`, "PUT", data);
}

export async function deleteService(id) {
  return apiRequest(`/services/${id}`, "DELETE");
}

// ===== LEGACY EXPORTS =====
export const apiGetBookings = getAllBookings;
export const apiCreateBooking = createBooking;
export const apiUpdateBooking = updateBookingStatus;

export { API_BASE };
