// src/pages/PreBooking/BookingsTable.jsx
import React from "react";
import BookingRow from "./BookingRow.jsx";

export default function BookingsTable({ bookings, onCarIn }) {
    if (!bookings?.length) {
        return (
            <div className="bg-white rounded-lg shadow border border-blue-100">
                <p className="text-center text-gray-500 p-4">No bookings yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-x-auto border border-blue-100">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Pre-Booked</th>
                        <th className="p-2 border">Reg No.</th>
                        <th className="p-2 border">Make & Model</th>
                        <th className="p-2 border">Client</th>
                        <th className="p-2 border">Phone</th>
                        <th className="p-2 border">Address</th>
                        <th className="p-2 border">Arrival (scheduled)</th>
                        <th className="p-2 border">Booking Price</th>
                        <th className="p-2 border">Labour</th>
                        <th className="p-2 border">Parts</th>
                        <th className="p-2 border">Profit</th>
                        <th className="p-2 border">Remarks</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b, i) => (
                        <BookingRow key={b._id} b={b} i={i} onCarIn={onCarIn} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
