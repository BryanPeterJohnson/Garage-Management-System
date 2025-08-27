// src/pages/RecentBookingRow.jsx
import React, { useMemo } from "react";

export default function RecentBookingRow({ booking, index }) {
    const fmtPKR = (val) => (val != null ? `PKR ${Number(val).toLocaleString("en-PK")}` : "");

    const profitPct = useMemo(() => {
        const totalCost = (Number(booking.labourCost) || 0) + (Number(booking.partsCost) || 0);
        return booking.bookingPrice ? ((Number(booking.bookingPrice) - totalCost) / Number(booking.bookingPrice)) * 100 : 0;
    }, [booking]);

    const servicesText = useMemo(() => {
        if (Array.isArray(booking.services) && booking.services.length > 0) {
            return booking.services.map(s => (typeof s === "object" ? s.label || s.name : s)).join(", ");
        }
        return booking.remarks || "—";
    }, [booking]);

    return (
        <tr className="hover:bg-gray-50">
            <td className="p-2 border">{index + 1}</td>
            <td className="p-2 border">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : ""}</td>
            <td className="p-2 border">{booking.carRegNo}</td>
            <td className="p-2 border">{booking.makeModel}</td>
            <td className="p-2 border">{booking.clientName}</td>
            <td className="p-2 border">{booking.clientAddress}</td>
            <td className="p-2 border">{booking.phoneNumber}</td>
            <td className="p-2 border">{servicesText}</td>
            <td className="p-2 border">{fmtPKR(booking.bookingPrice)}</td>
            <td className="p-2 border">{profitPct ? `${profitPct.toFixed(2)}%` : ""}</td>
            <td className="p-2 border">{booking.status}</td>
        </tr>
    );
}
