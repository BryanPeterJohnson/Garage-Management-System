import React from "react";
import BookingRow from "./BookingRow.jsx";

export default function BookingsTable({ bookings, onCarIn, onUpdate, saving }) {
    return (
        <div className="bg-white rounded-lg shadow border border-blue-100 overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-yellow-400 text-white">
                        <th className="p-2 border" scope="col">#</th>
                        <th className="p-2 border" scope="col">Booking Date</th>
                        <th className="p-2 border" scope="col">Reg#</th>
                        <th className="p-2 border" scope="col">Make & Model</th>
                        <th className="p-2 border" scope="col">Client</th>
                        <th className="p-2 border" scope="col">Address</th>
                        <th className="p-2 border" scope="col">Phone</th>
                        <th className="p-2 border" scope="col">Expected Arrival Date</th>
                        <th className="p-2 border" scope="col">Booking Price</th>
                        <th className="p-2 border" scope="col">Labour</th>
                        <th className="p-2 border" scope="col">Parts</th>
                        <th className="p-2 border" scope="col">Profit</th>
                        <th className="p-2 border" scope="col">Services</th>
                        <th className="p-2 border" scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <BookingRow
                            key={booking._id}
                            booking={booking}
                            index={index}
                            onCarIn={onCarIn}
                            onUpdate={onUpdate}
                            saving={saving}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
