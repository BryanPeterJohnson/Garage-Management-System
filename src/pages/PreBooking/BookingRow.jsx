import React, { useMemo, useState } from "react";
import { fmtDate, numberFmt, percentFmt } from "../../utils/fmt.js";
import StatusBadge from "./StatusBadge.jsx";

export default function BookingRow({ booking, index, onCarIn, onUpdate, saving }) {
    const [loadingCarIn, setLoadingCarIn] = useState(false);

    const profitPct = useMemo(() => {
        const price = booking.bookingPrice ?? 0;
        const cost = (booking.labourCost ?? 0) + (booking.partsCost ?? 0);
        if (cost <= 0) return price > 0 ? 100 : 0;
        return ((price - cost) / cost) * 100;
    }, [booking]);

    const handleCarIn = async () => {
        setLoadingCarIn(true);
        try {
            await onCarIn(booking);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCarIn(false);
        }
    };

    return (
        <tr className="hover:bg-yellow-50 transition">
            <td className="p-2 border">{index + 1}</td>
            <td className="p-2 border bg-green-400">{fmtDate(booking.createdAt)}</td>
            <td className="p-2 border">{booking.carRegNo}</td>
            <td className="p-2 border">{booking.makeModel}</td>
            <td className="p-2 border">{booking.clientName}</td>
            <td className="p-2 border">{booking.phoneNumber}</td>
            <td className="p-2 border">{booking.clientAddress}</td>
            <td className="p-2 border bg-red-400">{fmtDate(booking.scheduledArrivalDate)}</td>
            <td className="p-2 border">{numberFmt.format(booking.bookingPrice)}</td>
            <td className="p-2 border">{numberFmt.format(booking.labourCost)}</td>
            <td className="p-2 border">{numberFmt.format(booking.partsCost)}</td>
            <td className="p-2 border">{percentFmt(profitPct)}</td>
            <td className="p-2 border">
                {Array.isArray(booking.services) && booking.services.length > 0
                    ? booking.services.map(s => (typeof s === "object" ? s.label || s.name : s)).join(", ")
                    : booking.remarks ?? ""}
            </td>
            <td className="p-2 border"><StatusBadge status={booking.status} /></td>
            <td className="p-2 border text-center">
                <button
                    onClick={handleCarIn}
                    disabled={loadingCarIn || saving}
                    className={`bg-green-600 text-white px-3 py-1 rounded ${loadingCarIn || saving ? "opacity-60 cursor-not-allowed" : "hover:bg-green-500"}`}
                >
                    {loadingCarIn ? "..." : "Checkin"}
                </button>
            </td>
        </tr>
    );
}
