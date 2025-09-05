// src/pages/PreBooking/BookingRow.jsx
import React, { useState, useMemo } from "react";
import BookingForm from "./BookingForm.jsx";
import Modal from "../../components/Modal.jsx";

const formatDate = (date) => (date ? new Date(date).toISOString().slice(0, 10) : "");

export default function BookingRow({ booking, index, onUpdate }) {
  const [showEditModal, setShowEditModal] = useState(false);

  const profit =
    (booking.bookingPrice || 0) - ((booking.labourCost || 0) + (booking.partsCost || 0));
  const profitPercent =
    booking.bookingPrice > 0
      ? ((profit / booking.bookingPrice) * 100).toFixed(1)
      : "0.0";

  const servicesText = useMemo(() => {
    if (!booking.services) return "—";
    if (Array.isArray(booking.services)) {
      return booking.services
        .map((s) => (typeof s === "object" ? s.label || s.name || s.serviceName : s))
        .join(", ");
    }
    if (typeof booking.services === "object") {
      return booking.services.label || booking.services.name || booking.services.serviceName || "—";
    }
    return booking.services.toString();
  }, [booking.services]);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="p-3 border">{index + 1}</td>
        <td className="p-3 border">{formatDate(booking.createdAt)}</td>
        <td className="p-3 border">{formatDate(booking.scheduledDate)}</td>
        <td className="p-3 font-semibold border">{booking.vehicleRegNo || "—"}</td>
        <td className="p-3 border">{booking.makeModel || "—"}</td>
        <td className="p-3 border">{booking.ownerName || "—"}</td>
        <td className="p-3 border">{booking.ownerAddress || "—"}</td>
        <td className="p-3 border">{booking.ownerPostalCode || "—"}</td>
        <td className="p-3 border">{booking.ownerNumber || "—"}</td>
        <td className="p-3 text-right border">{(booking.bookingPrice || 0).toLocaleString()}</td>
        <td className="p-3 text-right  border">{(booking.labourCost || 0).toLocaleString()}</td>
        <td className="p-3 text-right border">{(booking.partsCost || 0).toLocaleString()}</td>
        <td className={`p-3 text-right font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
          {profit.toLocaleString()} ({profitPercent}%)
        </td>
        <td className="p-3 truncate max-w-[200px] border">{servicesText}</td>
        <td className="p-3 truncate max-w-[200px] border">{booking.remarks || "—"}</td>
        <td className="p-3">{booking.source || "—"}</td>
        <td className="p-3 text-center flex gap-1 justify-center border">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm"
            title="Check-in"
          >
            Check-in
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-sm"
            title="Edit Booking"
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>
        </td>
      </tr>

      {showEditModal && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <BookingForm
            loading={false}
            onCancel={() => setShowEditModal(false)}
            initialData={booking}
            onSubmit={async ({ payload, reset }) => {
              try {
                const res = await onUpdate(booking._id, payload);
                if (res.ok) {
                  reset?.();
                  setShowEditModal(false);
                } else {
                  alert(res.error || "Failed to update booking");
                }
              } catch (err) {
                console.error("Update failed:", err);
                alert("Failed to update booking");
              }
            }}
          />
        </Modal>
      )}
    </>
  );
}
