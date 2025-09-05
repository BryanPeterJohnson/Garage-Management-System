// src/pages/PreBooking/BookingsTable.jsx
import React, { useMemo } from "react";
import BookingRow from "./BookingRow.jsx";

export default function BookingsTable({ bookings, onUpdate }) {
  const recentBookings = useMemo(() => {
    // show latest 5 bookings by createdAt
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [bookings]);

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full border-collapse text-sm min-w-[1000px]">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-1">#</th>
            <th className="p-2">Booking Date</th>
            <th className="p-2">Landing Date</th>
            <th className="p-2">Reg No</th>
            <th className="p-3">Make & Model</th>
            <th className="p-3">Client</th>
            <th className="p-3">Address</th>
            <th className="p-3">Postal Code</th>
            <th className="p-3">Phone</th>
            <th className="p-3 text-right">Booking Price</th>
            <th className="p-3 text-right">Labour</th>
            <th className="p-3 text-right">Parts</th>
            <th className="p-3 text-right">Profit</th>
            <th className="p-3">Services</th>
            <th className="p-3">Remarks</th>
            <th className="p-3">Source</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {recentBookings.map((booking, idx) => (
            <BookingRow
              key={booking._id || idx}
              booking={booking}
              index={idx}
              onUpdate={onUpdate} // pass API update callback
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
