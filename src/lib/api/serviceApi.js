import axios from "./axiosInstance.js";

export async function getServices() {
    const res = await axios.get("/service"); // singular
    return res.data;
}

export async function createService(data) {
    const res = await axios.post("/service", data); // singular
    return res.data;
}

export async function updateService(id, data) {
    const res = await axios.patch(`/service/${id}`, data); // singular
    return res.data;
}

export async function deleteService(id) {
    const res = await axios.delete(`/service/${id}`); // singular
    return res.data;
}
