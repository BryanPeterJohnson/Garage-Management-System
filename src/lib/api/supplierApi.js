import axios from "./axiosInstance.js";

// Get all suppliers
export async function getSuppliers(params) {
    const res = await axios.get("/supplier", { params }); // match backend route
    return res.data;
}

// Get single supplier by ID
export async function getSupplierById(id) {
    const res = await axios.get(`/supplier/${id}`);
    return res.data;
}

// Create supplier
export async function createSupplier(data) {
    const res = await axios.post("/supplier", data);
    return res.data;
}

// Update supplier
export async function updateSupplier(id, data) {
    const res = await axios.put(`/supplier/${id}`, data); // use PUT to match backend
    return res.data;
}

// Delete supplier
export async function deleteSupplier(id) {
    const res = await axios.delete(`/supplier/${id}`);
    return res.data;
}
