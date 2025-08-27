// app/src/pages/CarIn/CarInRow.jsx
import React, { useMemo } from "react";

const numberFmt = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

export default function CarInRow({ booking, index, onCarOut, isLoading }) {
    const profit = useMemo(() => {
        const price = Number(booking.bookingPrice) || 0;
        const labour = Number(booking.labourCost) || 0;
        const parts = Number(booking.partsCost) || 0;
        return price - labour - parts;
    }, [booking]);

    const servicesText = useMemo(() => {
        if (Array.isArray(booking.services) && booking.services.length > 0) {
            return booking.services.map(s => (typeof s === "object" ? s.name || s.label : s)).join(", ");
        }
        return booking.remarks || "—";
    }, [booking]);

    const handleOutClick = async () => {
        await onCarOut(booking);
    };

    return (
        <tr className="hover:bg-blue-50 transition">
            <td className="p-2 border">{index + 1}</td>
            <td className="p-2 border bg-green-400">
                {booking.arrivedAt
                    ? new Date(booking.arrivedAt).toLocaleDateString("en-GB")
                    : "—"}
            </td>
            <td className="p-2 border">{booking.carRegNo}</td>
            <td className="p-2 border">{booking.makeModel}</td>
            <td className="p-2 border">{booking.clientName}</td>
            <td className="p-2 border">{booking.phoneNumber}</td>
            <td className="p-2 border">{booking.clientAddress}</td>
            <td className="p-2 border">{numberFmt.format(booking.bookingPrice || 0)}</td>
            <td className="p-2 border">{numberFmt.format(booking.labourCost || 0)}</td>
            <td className="p-2 border">{numberFmt.format(booking.partsCost || 0)}</td>
            <td className="p-2 border">{numberFmt.format(profit)}</td>
            <td className="p-2 border">{servicesText}</td>
            <td className="p-2 border capitalize">{booking.status}</td>
            <td className="p-2 border text-center">
                <button
                    onClick={handleOutClick}
                    disabled={isLoading}
                    className={`bg-green-600 text-white px-3 py-1 rounded ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-500"
                        }`}
                >
                    {isLoading ? "Processing..." : "Checkout"}
                </button>
            </td>
        </tr>
    );
}
