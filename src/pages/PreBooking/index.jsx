import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useBookings from "../../hooks/useBookings.js";
import PreBookingTable from "./BookingsTable.jsx";
import BookingForm from "./BookingForm.jsx";
import { toast } from "react-toastify";
import InlineSpinner from "../../components/InlineSpinner.jsx";
import Modal from "../../components/Modal.jsx";

export default function PreBookingPage() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [loadingCarInId, setLoadingCarInId] = useState(null);

    const {
        list: bookings,
        loadingList,
        saving,
        error,
        setError,
        create,
        updateStatus,
        page,
        setPage,
        totalPages,
        totalItems,
    } = useBookings({ status: "pending", pageSize: 20 });

    // --- Handle Car In (mark booking as arrived) ---
    const handleCarIn = useCallback(async (booking) => {
        setLoadingCarInId(booking._id);
        try {
            const res = await updateStatus(booking._id, "arrived");
            if (res.ok) {
                toast.success("Car marked as arrived!");
                navigate("/car-in");
            } else {
                toast.error(res.error || "Failed to mark car as arrived");
            }
        } catch (err) {
            const msg = err.message || "Failed to mark car as arrived";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoadingCarInId(null);
        }
    }, [updateStatus, navigate, setError]);

    // --- Handle new booking creation ---
    const handleCreate = useCallback(async ({ payload, reset, error: errMsg }) => {
        if (errMsg) {
            setError(errMsg);
            toast.error(errMsg);
            return;
        }
        const res = await create(payload);
        if (res.ok) {
            reset?.();
            setShowModal(false);
            toast.success("Booking created successfully!");
        }
    }, [create, setError]);

    return (
        <div className="p-4 relative">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Pre-Booking</h1>

            {loadingList ? (
                <div className="bg-white rounded-lg shadow border border-blue-100 p-4 text-center text-gray-500 inline-flex items-center justify-center gap-2">
                    <InlineSpinner /> Loading bookings…
                </div>
            ) : bookings.length === 0 ? (
                <div className="p-6 bg-yellow-100 text-yellow-800 rounded">No pending bookings found.</div>
            ) : (
                <>
                    <PreBookingTable
                        bookings={bookings}
                        onCarIn={handleCarIn}
                        loadingCarInId={loadingCarInId}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                            <button
                                disabled={page <= 1}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 border rounded">
                                Page {page} of {totalPages} ({totalItems} bookings)
                            </span>
                            <button
                                disabled={page >= totalPages}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Floating plus button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full text-3xl font-bold flex items-center justify-center shadow-lg"
                title="Add New Booking"
            >
                +
            </button>

            {/* Booking Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <BookingForm
                    loading={saving}
                    onSubmit={handleCreate}
                    onCancel={() => setShowModal(false)}
                />
            </Modal>
        </div>
    );
}
