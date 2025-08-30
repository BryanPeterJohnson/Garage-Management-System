// src/pages/PreBooking/BookingRow.jsx
import React, { useMemo, useState } from "react";
import { fmtDate, numberFmt, percentFmt } from "../../utils/fmt.js";

export default function BookingRow({ booking, index, onCarIn, saving }) {
    const [loadingCarIn, setLoadingCarIn] = useState(false);

    const profit = useMemo(() => {
        const price = Number(booking.bookingPrice) || 0;
        const cost = (Number(booking.labourCost) || 0) + (Number(booking.partsCost) || 0);
        return price - cost;
    }, [booking]);

    const profitPct = useMemo(() => {
        const price = Number(booking.bookingPrice) || 0;
        return price ? ((profit / price) * 100).toFixed(2) : "0.00";
    }, [booking, profit]);

    const servicesText = useMemo(() => {
        if (Array.isArray(booking.services) && booking.services.length > 0) {
            return booking.services.map(s => (typeof s === "object" ? s.label || s.name : s)).join(", ");
        }
        return booking.remarks || "—";
    }, [booking]);

    const handleCarInClick = async () => {
        setLoadingCarIn(true);
        try {
            await onCarIn(booking);
        } finally {
            setLoadingCarIn(false);
        }
    };

    return (
        <tr className="hover:bg-yellow-50 transition">
            <td className="p-2 border">{index + 1}</td>
            <td className="p-2 border bg-green-100">{fmtDate(booking.createdAt)}</td>
            <td className="p-2 border">{booking.vehicleRegNo}</td>
            <td className="p-2 border">{booking.makeModel}</td>
            <td className="p-2 border">{booking.ownerName}</td>
            <td className="p-2 border">{booking.ownerAddress}</td>
            <td className="p-2 border">{booking.ownerNumber}</td>
            <td className="p-2 border bg-red-100">{fmtDate(booking.scheduledDate)}</td>
            <td className="p-2 border">{numberFmt.format(booking.bookingPrice)}</td>
            <td className="p-2 border">{numberFmt.format(booking.labourCost)}</td>
            <td className="p-2 border">{numberFmt.format(booking.partsCost)}</td>
            <td className="p-2 border">{numberFmt.format(profit)} ({profitPct}%)</td>
            <td className="p-2 border">{servicesText}</td>
            <td className="p-2 border text-center">
                <button
                    onClick={handleCarInClick}
                    disabled={loadingCarIn || saving}
                    className={`bg-green-600 text-white px-3 py-1 rounded ${loadingCarIn || saving ? "opacity-60 cursor-not-allowed" : "hover:bg-green-500"
                        }`}
                >
                    {loadingCarIn ? "Processing..." : "Checkin"}
                </button>
            </td>
        </tr>
    );
}
