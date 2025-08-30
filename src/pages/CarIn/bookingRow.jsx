// src/pages/CarIn/BookingRow.jsx
import React, { useMemo } from "react";

// Format numbers in GBP
const numberFmt = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

export default function BookingRow({ booking, index, onCarOut, onAddUpsell, isLoading }) {
    // Calculate profit in GBP
    const profit = useMemo(() => {
        const price = Number(booking.bookingPrice) || 0;
        const labour = Number(booking.labourCost) || 0;
        const parts = Number(booking.partsCost) || 0;
        return price - labour - parts;
    }, [booking]);

    // Optionally, profit percentage
    const profitPct = useMemo(() => {
        const price = Number(booking.bookingPrice) || 0;
        return price ? ((profit / price) * 100).toFixed(2) : "0.00";
    }, [booking, profit]);

    // Display services as comma-separated list, fallback to remarks
    const servicesText = useMemo(() => {
        if (Array.isArray(booking.services) && booking.services.length > 0) {
            return booking.services
                .map((s) => (typeof s === "object" ? s.name || s.label : s))
                .join(", ");
        }
        return booking.remarks || "—";
    }, [booking]);

    const handleCarOutClick = async () => {
        if (onCarOut) await onCarOut(booking);
    };

    const handleAddUpsellClick = () => {
        if (onAddUpsell) onAddUpsell(booking);
    };

    return (
        <tr className="hover:bg-blue-50 transition">
            <td className="p-2 border">{index + 1}</td>

            {/* Arrival Date */}
            <td className="p-2 border">
                {booking.arrivedAt ? new Date(booking.arrivedAt).toLocaleDateString("en-GB") : "—"}
            </td>

            <td className="p-2 border">{booking.vehicleRegNo}</td>
            <td className="p-2 border">{booking.makeModel}</td>
            <td className="p-2 border">{booking.ownerName}</td>
            <td className="p-2 border">{booking.ownerNumber}</td>
            <td className="p-2 border">{booking.ownerAddress}</td>

            {/* Pricing */}
            <td className="p-2 border">{numberFmt.format(booking.bookingPrice || 0)}</td>
            <td className="p-2 border">{numberFmt.format(booking.labourCost || 0)}</td>
            <td className="p-2 border">{numberFmt.format(booking.partsCost || 0)}</td>
            <td className="p-2 border">{numberFmt.format(profit)} ({profitPct}%)</td>

            {/* Services */}
            <td className="p-2 border">{servicesText}</td>

            {/* Status */}
            <td className="p-2 border capitalize">{booking.status}</td>

            {/* Actions */}
            <td className="p-2 border flex justify-center gap-2">
                <button
                    onClick={handleAddUpsellClick}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                >
                    Upsell
                </button>
                <button
                    onClick={handleCarOutClick}
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
