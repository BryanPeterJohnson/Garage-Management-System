import React, { useEffect, useState } from "react";
import { getSuppliers, createSupplier, updateSupplier } from "../../lib/api/supplierApi.js";
import { getParts, createPart, updatePart } from "../../lib/api/partsApi.js";
import { getServices, createService, updateService } from "../../lib/api/serviceApi.js";
import Modal from "../../components/Modal.jsx";

export default function AddPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [parts, setParts] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    // modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // "supplier", "part", "service", "menu", "view"
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false); // view vs edit

    // search state
    const [searchSup, setSearchSup] = useState("");
    const [searchParts, setSearchParts] = useState("");
    const [searchServ, setSearchServ] = useState("");

    const fetchAll = async () => {
        try {
            setLoading(true);
            const [supRes, partsRes, servRes] = await Promise.all([
                getSuppliers(),
                getParts(),
                getServices(),
            ]);
            setSuppliers(supRes);
            setParts(partsRes);
            setServices(servRes);
        } catch (err) {
            console.error("❌ Error fetching data:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    // open modal for form or view
    const openModal = (type, data = {}) => {
        setModalType(type);
        setFormData(data);
        setModalOpen(true);
        setIsEditing(type === "supplier" || type === "part" || type === "service" ? false : false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (modalType === "supplier") {
                if (isEditing) await updateSupplier(formData._id, formData);
                else await createSupplier(formData);
            } else if (modalType === "part") {
                if (isEditing) await updatePart(formData._id, formData);
                else await createPart(formData);
            } else if (modalType === "service") {
                if (isEditing) await updateService(formData._id, formData);
                else await createService(formData);
            }
            setModalOpen(false);
            setIsEditing(false);
            fetchAll();
        } catch (err) {
            console.error("❌ Error saving:", err.response?.data?.error || err.message);
        } finally { setLoading(false); }
    };

    // filter function
    const filterItems = (items, search, field) =>
        items.filter((item) => item[field].toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add / Manage Entities</h1>

            {/* Floating + Button */}
            <button
                onClick={() => openModal("menu")}
                className="fixed bottom-6 right-6 bg-blue-600 text-white text-3xl w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
            >
                +
            </button>

            {/* Modal */}
            {modalOpen && modalType !== "menu" && (
                <Modal onClose={() => { setModalOpen(false); setIsEditing(false); }}>
                    {isEditing ? (
                        // Edit form
                        <>
                            <h2 className="text-xl font-bold mb-4">Edit {modalType}</h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                {modalType === "supplier" && (
                                    <>
                                        <input type="text" name="name" placeholder="Supplier Name"
                                            value={formData.name || ""} onChange={handleChange} required className="border p-2 rounded" />
                                        <input type="text" name="contact" placeholder="Contact"
                                            value={formData.contact || ""} onChange={handleChange} required className="border p-2 rounded" />
                                        <input type="text" name="bankAccount" placeholder="Bank Account"
                                            value={formData.bankAccount || ""} onChange={handleChange} required className="border p-2 rounded" />
                                        <input type="email" name="email" placeholder="Email"
                                            value={formData.email || ""} onChange={handleChange} required className="border p-2 rounded" />
                                        <input type="text" name="address" placeholder="Address"
                                            value={formData.address || ""} onChange={handleChange} className="border p-2 rounded" />
                                    </>
                                )}
                                {modalType === "part" && (
                                    <>
                                        <input type="text" name="partName" placeholder="Part Name"
                                            value={formData.partName || ""} onChange={handleChange} required className="border p-2 rounded" />
                                        <input type="text" name="partNumber" placeholder="Part Number"
                                            value={formData.partNumber || ""} onChange={handleChange} className="border p-2 rounded" />
                                    </>
                                )}
                                {modalType === "service" && (
                                    <input type="text" name="name" placeholder="Service Name"
                                        value={formData.name || ""} onChange={handleChange} required className="border p-2 rounded" />
                                )}
                                <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2">Save</button>
                            </form>
                        </>
                    ) : (
                        // View mode
                        <>
                            <h2 className="text-xl font-bold mb-4">{modalType} Details</h2>
                            {Object.keys(formData).map((key) => (
                                <div key={key} className="mb-2">
                                    <strong>{key}: </strong>
                                    {typeof formData[key] === "object" && formData[key] !== null
                                        ? JSON.stringify(formData[key])
                                        : formData[key]}
                                </div>
                            ))}
                            <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-4 py-2 rounded mt-3">Edit</button>
                        </>
                    )}
                </Modal>
            )}

            {/* Scrollable lists with search */}
            <div className="grid grid-cols-3 gap-4 mt-6">
                {/* Suppliers */}
                <div className="border rounded p-3 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold mb-2">Suppliers</h3>
                    <input type="text" placeholder="Search..." value={searchSup} onChange={e => setSearchSup(e.target.value)}
                        className="border p-1 mb-2 w-full rounded" />
                    {filterItems(suppliers, searchSup, "name").map((s) => (
                        <div key={s._id} className="border-b py-1 cursor-pointer hover:bg-gray-100"
                            onClick={() => openModal("supplier", s)}>
                            {s.name}
                        </div>
                    ))}
                </div>

                {/* Parts */}
                <div className="border rounded p-3 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold mb-2">Parts</h3>
                    <input type="text" placeholder="Search..." value={searchParts} onChange={e => setSearchParts(e.target.value)}
                        className="border p-1 mb-2 w-full rounded" />
                    {filterItems(parts, searchParts, "partName").map((p) => (
                        <div key={p._id} className="border-b py-1 cursor-pointer hover:bg-gray-100"
                            onClick={() => openModal("part", p)}>
                            {p.partName}
                        </div>
                    ))}
                </div>

                {/* Services */}
                <div className="border rounded p-3 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold mb-2">Services</h3>
                    <input type="text" placeholder="Search..." value={searchServ} onChange={e => setSearchServ(e.target.value)}
                        className="border p-1 mb-2 w-full rounded" />
                    {filterItems(services, searchServ, "name").map((s) => (
                        <div key={s._id} className="border-b py-1 cursor-pointer hover:bg-gray-100"
                            onClick={() => openModal("service", s)}>
                            {s.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating + Menu */}
            {modalOpen && modalType === "menu" && (
                <Modal onClose={() => setModalOpen(false)}>
                    <h2 className="text-xl font-bold mb-4">Add New</h2>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => openModal("supplier")} className="bg-blue-500 text-white py-2 rounded">Supplier</button>
                        <button onClick={() => openModal("part")} className="bg-yellow-500 text-white py-2 rounded">Part</button>
                        <button onClick={() => openModal("service")} className="bg-green-500 text-white py-2 rounded">Service</button>
                    </div>
                </Modal>
            )}

            {loading && <p className="text-gray-500 mt-4">Loading...</p>}
        </div>
    );
}
