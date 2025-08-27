import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useBookings from "../../hooks/useBookings.js";
import BookingForm from "./BookingForm.jsx";
import PreBookingTable from "./BookingsTable.jsx";
import { updateBookingStatus } from "../../lib/api/bookingApi.js";
import { toast } from "react-toastify";
import InlineSpinner from "../../components/InlineSpinner.jsx";

export default function PreBookingPage() {
    const { list: bookings, loadingList, saving, error, setError, create, refresh } = useBookings({ status: "pending" });
    const [showForm, setShowForm] = useState(false);
    const [loadingCarInId, setLoadingCarInId] = useState(null);
    const navigate = useNavigate();

    const handleCarIn = useCallback(async (booking) => {
        setLoadingCarInId(booking._id);
        try {
            await updateBookingStatus(booking._id, "arrived");
            toast.success("Car marked as arrived!");
            await refresh?.();
            navigate("/car-in");
        } catch (err) {
            const backendMessage = err.response?.data?.error || err.response?.data?.errors?.[0]?.message || err.message;
            setError(`Failed to update status: ${backendMessage}`);
            toast.error(`Failed to mark car as arrived: ${backendMessage}`);
        } finally {
            setLoadingCarInId(null);
        }
    }, [navigate, setError, refresh]);

    const handleCreate = useCallback(async ({ payload, reset, error: errMsg }) => {
        if (errMsg) {
            setError(errMsg);
            toast.error(errMsg);
            return;
        }
        const res = await create(payload);
        if (res.ok) {
            reset?.();
            setShowForm(false);
            toast.success("Booking created successfully!");
        }
    }, [create, setError]);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-blue-900">Pre-Booking</h1>
                <button
                    onClick={() => { setError(""); setShowForm(v => !v); }}
                    disabled={saving}
                    className={`bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                    {showForm ? "Cancel" : "+ Add New Booking"}
                </button>
            </div>

            {saving && <div className="mb-3 rounded-md bg-yellow-100 text-yellow-900 px-3 py-2 text-sm inline-flex items-center gap-2"><InlineSpinner /> Saving changes…</div>}
            {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>}
            {showForm && <BookingForm loading={saving} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

            {loadingList ? (
                <div className="bg-white rounded-lg shadow border border-blue-100 p-4 text-center text-gray-500 inline-flex items-center justify-center gap-2"><InlineSpinner /> Loading bookings…</div>
            ) : bookings.length === 0 ? (
                <div className="p-6 bg-yellow-100 text-yellow-800 rounded">No pending bookings found.</div>
            ) : (
                <PreBookingTable bookings={bookings} onCarIn={handleCarIn} loadingCarInId={loadingCarInId} />
            )}
        </div>
    );
}
