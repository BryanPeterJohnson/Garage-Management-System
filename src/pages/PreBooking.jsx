// src/pages/PreBooking.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EMPTY = {
    date: "",
    regNo: "",
    makeModel: "",
    clientName: "",
    address: "",
    phone: "",
    remarks: "",
    confirmedDate: "",
    price: "",
    labour: "",
    parts: "",
    profit: "",
    profitPercentage: "",
    status: "Pending",
};

export default function PreBooking() {
    const [formData, setFormData] = useState(EMPTY);
    const [bookings, setBookings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // hydrate from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("gms_prebookings");
        if (saved) setBookings(JSON.parse(saved));
    }, []);

    // persist to localStorage
    useEffect(() => {
        localStorage.setItem("gms_prebookings", JSON.stringify(bookings));
    }, [bookings]);

    // auto-calculate profit and profit percentage
    useEffect(() => {
        const price = parseFloat(formData.price) || 0;
        const labour = parseFloat(formData.labour) || 0;
        const parts = parseFloat(formData.parts) || 0;
        const cost = labour + parts;
        const profit = price - cost;
        const profitPercentage = cost > 0 ? (profit / cost) * 100 : 0;

        setFormData((prev) => ({
            ...prev,
            profit: profit.toFixed(2),
            profitPercentage: profitPercentage.toFixed(2),
        }));
    }, [formData.price, formData.labour, formData.parts]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const required = ["date", "regNo", "makeModel", "clientName", "address", "phone"];
        const missing = required.filter((k) => !String(formData[k]).trim());
        if (missing.length) {
            setError(`Please fill: ${missing.join(", ")}`);
            return;
        }

        const nextId = (bookings.at(-1)?.id ?? 0) + 1;
        setBookings((b) => [...b, { ...formData, id: nextId }]);
        setFormData(EMPTY);
        setShowForm(false);
    };

    const clearAll = () => {
        if (confirm("Clear all pre-bookings?")) setBookings([]);
    };

    const handleCarIn = (booking) => {
        localStorage.setItem("gms_selectedBooking", JSON.stringify(booking));
        navigate("/car-in");
    };

    return (
        <div className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-blue-900">Pre-Booking</h1>
                <div className="flex items-center gap-2">
                    {bookings.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300"
                            title="Clear saved pre-bookings (local only)"
                        >
                            Clear
                        </button>
                    )}
                    <button
                        onClick={() => setShowForm((v) => !v)}
                        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {showForm ? "Cancel" : "+ Add New Booking"}
                    </button>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-blue-100 mb-6"
                >
                    {error && <div className="md:col-span-2 text-sm text-red-600">{error}</div>}

                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                    <input type="text" name="regNo" placeholder="Reg No." value={formData.regNo} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                    <input type="text" name="makeModel" placeholder="Make & Model" value={formData.makeModel} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                    <input type="text" name="clientName" placeholder="Client Name" value={formData.clientName} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                    <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                    <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
                    <input type="text" name="remarks" placeholder="Remarks" value={formData.remarks} onChange={handleChange} className="border border-gray-300 rounded p-2" />
                    <input type="date" name="confirmedDate" value={formData.confirmedDate} onChange={handleChange} className="border border-gray-300 rounded p-2" />
                    <input type="number" name="price" placeholder="Booking Price" value={formData.price} onChange={handleChange} className="border border-gray-300 rounded p-2" min="0" />
                    <input type="number" name="labour" placeholder="Labour Cost" value={formData.labour} onChange={handleChange} className="border border-gray-300 rounded p-2" min="0" />
                    <input type="number" name="parts" placeholder="Parts Cost" value={formData.parts} onChange={handleChange} className="border border-gray-300 rounded p-2" min="0" />
                    <input type="text" name="profit" placeholder="Profit" value={formData.profit} readOnly className="border border-gray-300 rounded p-2 bg-gray-100" />
                    <input type="text" name="profitPercentage" placeholder="Profit %" value={formData.profitPercentage} readOnly className="border border-gray-300 rounded p-2 bg-gray-100" />

                    <select name="status" value={formData.status} onChange={handleChange} className="border border-gray-300 rounded p-2">
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <div className="md:col-span-2 flex gap-2">
                        <button type="submit" className="flex-1 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold py-2 rounded hover:shadow-lg transition">
                            Save Booking
                        </button>
                        <button type="button" onClick={() => setFormData(EMPTY)} className="px-4 py-2 border rounded hover:bg-gray-50">
                            Reset
                        </button>
                    </div>
                </form>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto border border-blue-100">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-blue-900 text-white">
                            <th className="p-2 border">Sr No.</th>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Reg No.</th>
                            <th className="p-2 border">Make & Model</th>
                            <th className="p-2 border">Client Name</th>
                            <th className="p-2 border">Address</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border">Remarks</th>
                            <th className="p-2 border">Confirmed Date</th>
                            <th className="p-2 border">Booking Price</th>
                            <th className="p-2 border">Labour</th>
                            <th className="p-2 border">Parts</th>
                            <th className="p-2 border">Profit</th>
                            <th className="p-2 border">Profit %</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id} className="hover:bg-blue-50 transition">
                                <td className="p-2 border">{b.id}</td>
                                <td className="p-2 border">{b.date}</td>
                                <td className="p-2 border">{b.regNo}</td>
                                <td className="p-2 border">{b.makeModel}</td>
                                <td className="p-2 border">{b.clientName}</td>
                                <td className="p-2 border">{b.address}</td>
                                <td className="p-2 border">{b.phone}</td>
                                <td className="p-2 border">{b.remarks}</td>
                                <td className="p-2 border">{b.confirmedDate}</td>
                                <td className="p-2 border">{b.price}</td>
                                <td className="p-2 border">{b.labour}</td>
                                <td className="p-2 border">{b.parts}</td>
                                <td className="p-2 border">{b.profit}</td>
                                <td className="p-2 border">{b.profitPercentage}%</td>
                                <td
                                    className={`p-2 border font-semibold ${b.status === "Confirmed"
                                            ? "text-green-600"
                                            : b.status === "Pending"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                        }`}
                                >
                                    {b.status}
                                </td>
                                <td className="p-2 border text-center">
                                    <button
                                        onClick={() => handleCarIn(b)}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                                    >
                                        Car In
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <p className="text-center text-gray-500 p-4">No bookings yet</p>
                )}
            </div>
        </div>
    );
}
