// src/pages/PreBooking/index.jsx
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBookings from "../../hooks/useBookings.js";
import BookingForm from "./BookingForm.jsx";
import BookingsTable from "./BookingsTable.jsx";

export default function PreBookingPage() {
    const { list: bookings, loadingList, saving, error, setError, create } = useBookings();
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const onCarIn = useCallback((booking) => {
        localStorage.setItem("gms_selectedBooking", JSON.stringify(booking));
        navigate("/car-in");
    }, [navigate]);

    const handleCreate = useCallback(async ({ payload, reset, error: errMsg }) => {
        if (errMsg) return setError(errMsg);
        const res = await create(payload);
        if (res.ok) {
            reset?.();
            setShowForm(false);
        }
    }, [create, setError]);

    return (
        <div className="p-0">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-blue-900">Pre-Booking</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setError(""); setShowForm((v) => !v); }}
                        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {showForm ? "Cancel" : "+ Add New Booking"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
                    {error}
                </div>
            )}

            {showForm && (
                <BookingForm loading={saving} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
            )}

            {loadingList ? (
                <div className="bg-white rounded-lg shadow border border-blue-100">
                    <p className="text-center text-gray-500 p-4">Loading…</p>
                </div>
            ) : (
                <BookingsTable bookings={bookings} onCarIn={onCarIn} />
            )}
        </div>
    );
}
