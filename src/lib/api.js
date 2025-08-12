// app/src/lib/api.js
const API_BASE = "http://127.0.0.1:5000/api";

export function setToken(token) { localStorage.setItem("gms_token", token); }
export function clearToken() { localStorage.removeItem("gms_token"); }
export function getToken() { return localStorage.getItem("gms_token"); }

export async function apiLogin(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    let data = null;
    try { data = await res.json(); } catch { }
    if (!res.ok) throw new Error((data && data.error) || `${res.status} ${res.statusText}`);
    return data;
}
