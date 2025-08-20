// app/src/pages/PreBooking/index.jsx
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBookings from "../../hooks/useBookings.js";
import BookingForm from "./BookingForm.jsx";
import BookingsTable from "./BookingsTable.jsx";
import { updateBookingStatus } from "../../lib/api.js"; // ⬅ added

function InlineSpinner() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" className="inline-block">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
            <path
                d="M22 12a10 10 0 0 0-10-10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="0.8s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    );
}

export default function PreBookingPage() {
    const { list: bookings, loadingList, saving, error, setError, create, update } = useBookings();
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    // ✅ Updated to call API before navigating
    const onCarIn = useCallback(
        async (booking) => {
            try {
                await updateBookingStatus(booking._id, "arrived");
                booking.status = "arrived"; // update locally so UI updates
                localStorage.setItem("gms_selectedBooking", JSON.stringify(booking));
                navigate("/car-in");
            } catch (err) {
                setError(`Failed to update status: ${err.message}`);
            }
        },
        [navigate, setError]
    );

    const handleCreate = useCallback(
        async ({ payload, reset, error: errMsg }) => {
            if (errMsg) return setError(errMsg);
            const res = await create(payload);
            if (res.ok) {
                reset?.();
                setShowForm(false);
            }
        },
        [create, setError]
    );

    return (
        <div className="p-0">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-blue-900">Pre-Booking</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setError("");
                            setShowForm((v) => !v);
                        }}
                        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {showForm ? "Cancel" : "+ Add New Booking"}
                    </button>
                </div>
            </div>

            {saving && (
                <div
                    role="status"
                    aria-live="polite"
                    className="mb-3 rounded-md bg-yellow-100 text-yellow-900 px-3 py-2 text-sm inline-flex items-center gap-2"
                >
                    <InlineSpinner /> Saving changes…
                </div>
            )}

            {error && (
                <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
                    {error}
                </div>
            )}

            {showForm && (
                <BookingForm
                    loading={saving}
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {loadingList ? (
                <div className="bg-white rounded-lg shadow border border-blue-100">
                    <p className="text-center text-gray-500 p-4 inline-flex items-center gap-2">
                        <InlineSpinner /> Loading bookings…
                    </p>
                </div>
            ) : (
                <BookingsTable
                    bookings={bookings}
                    saving={saving}
                    onCarIn={onCarIn}
                    onUpdate={async (id, patch) => {
                        const res = await update(id, patch);
                        return res;
                    }}
                />
            )}
        </div>
    );
}
