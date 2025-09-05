// src/pages/Settings/index.jsx
import React, { useEffect, useState } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../lib/api/servicesApi.js"; // adjust path if needed

export default function Settings() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error("❌ Error fetching services:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newService.trim()) return;
    try {
      setLoading(true);
      await createService({ name: newService.trim() });
      setNewService("");
      fetchServices();
    } catch (err) {
      console.error("❌ Error adding service:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      setLoading(true);
      await deleteService(id);
      fetchServices();
    } catch (err) {
      console.error("❌ Error deleting service:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (!editingName.trim()) return;
    try {
      setLoading(true);
      await updateService(editingId, { name: editingName.trim() });
      setEditingId(null);
      setEditingName("");
      fetchServices();
    } catch (err) {
      console.error("❌ Error updating service:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Service Settings</h1>

      {/* Add Service */}
      <form onSubmit={handleCreateService} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter service name"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {/* Service List */}
      <ul className="space-y-2">
        {services.map((service) => (
          <li
            key={service._id}
            className="flex justify-between items-center border rounded p-2"
          >
            {editingId === service._id ? (
              <form onSubmit={handleUpdateService} className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border rounded p-2 flex-1"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-3 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-3 rounded"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span>{service.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditService(service._id, service.name)}
                    className="bg-yellow-500 text-white px-3 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="bg-red-600 text-white px-3 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {loading && <p className="text-gray-500 mt-4">Loading...</p>}
    </div>
  );
}
