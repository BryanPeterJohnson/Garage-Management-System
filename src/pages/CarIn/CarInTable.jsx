// app/src/pages/CarIn/CarInTable.jsx
import React from "react";
import CarInRow from "./CarInRow.jsx";

export default function CarInTable({ bookings, onCarOut, loadingCarOutId }) {
    return (
        <div className="bg-white rounded-lg shadow border border-blue-100 overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-blue-400 text-white">
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Arrival Date</th>
                        <th className="p-2 border">Reg#</th>
                        <th className="p-2 border">Make & Model</th>
                        <th className="p-2 border">Client</th>
                        <th className="p-2 border">Phone</th>
                        <th className="p-2 border">Address</th>
                        <th className="p-2 border">Booking Price</th>
                        <th className="p-2 border">Labour</th>
                        <th className="p-2 border">Parts</th>
                        <th className="p-2 border">Profit</th>
                        <th className="p-2 border">Services</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <CarInRow
                            key={booking._id}
                            booking={booking}
                            index={index}
                            onCarOut={onCarOut}
                            isLoading={loadingCarOutId === booking._id} // pass per-row loading state
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
