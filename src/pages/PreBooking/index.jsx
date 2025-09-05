// src/pages/PreBooking/PreBookingPage.jsx
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useBookings from "../../hooks/useBookings.js";
import BookingsTable from "./BookingsTable.jsx";
import BookingForm from "./BookingForm.jsx";
import { toast } from "react-toastify";
import InlineSpinner from "../../components/InlineSpinner.jsx";
import Modal from "../../components/Modal.jsx";

export default function PreBookingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null); // null = create, object = update
  const [loadingCarInId, setLoadingCarInId] = useState(null);

  const {
    list: bookings,
    loadingList,
    saving,
    error,
    setError,
    create,
    update,
    updateStatus,
    page,
    setPage,
    totalPages,
    totalItems,
  } = useBookings({ status: "pending", pageSize: 20 });

  // --- Inline update handler from table ---
  const handleUpdate = useCallback(
    async (id, payload) => {
      const res = await update(id, payload);
      if (!res.ok) toast.error(res.error || "Failed to update booking");
      return res;
    },
    [update]
  );

  // --- Mark car as arrived ---
  const handleCarIn = useCallback(
    async (booking) => {
      setLoadingCarInId(booking._id);
      const res = await updateStatus(booking._id, "arrived");
      if (res.ok) {
        toast.success("Car marked as arrived!");
        navigate("/car-in");
      } else toast.error(res.error || "Failed to mark car as arrived");
      setLoadingCarInId(null);
    },
    [updateStatus, navigate]
  );

  // --- Open create booking modal ---
  const handleAddBooking = () => {
    setEditingBooking(null); // null = create
    setShowModal(true);
  };

  // --- Open edit booking modal ---
  const handleEditBooking = (booking) => {
    setEditingBooking(booking); // pass booking to prefill form
    setShowModal(true);
  };

  // --- Handle create or update submit ---
  const handleFormSubmit = useCallback(
    async ({ payload, reset, error: errMsg }) => {
      if (errMsg) return toast.error(errMsg);

      if (editingBooking) {
        // Update existing booking
        const res = await update(editingBooking._id, payload);
        if (res.ok) {
          toast.success("Booking updated successfully!");
          setShowModal(false);
          setEditingBooking(null);
        } else toast.error(res.error || "Failed to update booking");
      } else {
        // Create new booking
        const res = await create(payload);
        if (res.ok) {
          toast.success("Booking created successfully!");
          reset?.();
          setShowModal(false);
        } else toast.error(res.error || "Failed to create booking");
      }
    },
    [create, update, editingBooking]
  );

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
          <BookingsTable
            bookings={bookings}
            onUpdate={handleUpdate}
            onEdit={handleEditBooking} // pass edit callback for row modal
          />

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

      <button
        onClick={handleAddBooking}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full text-3xl font-bold flex items-center justify-center shadow-lg"
        title="Add New Booking"
      >
        +
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <BookingForm
          loading={saving}
          booking={editingBooking} // prefill form if editing
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}
