// src/pages/PreBooking/BookingRow.jsx
import React from "react";
import { fmtDate, numberFmt, percentFmt } from "../../utils/fmt.js";
import StatusBadge from "./StatusBadge.jsx";

export default function BookingRow({ b, i, onCarIn }) {
    const cost = (b.labourCost ?? 0) + (b.partsCost ?? 0);
    const profitPct =
        cost > 0
            ? (((b.bookingPrice ?? 0) - (b.labourCost ?? 0) - (b.partsCost ?? 0)) / cost) * 100
            : 0;

    return (
        <tr className="hover:bg-blue-50 transition">
            <td className="p-2 border">{i + 1}</td>
            <td className="p-2 border">{fmtDate(b.preBookingDate)}</td>
            <td className="p-2 border">{b.carRegNo}</td>
            <td className="p-2 border">{b.makeModel}</td>
            <td className="p-2 border">{b.clientName}</td>
            <td className="p-2 border">{b.phoneNumber}</td>
            <td className="p-2 border">{b.clientAddress}</td>
            <td className="p-2 border">{fmtDate(b.scheduledArrivalDate)}</td>
            <td className="p-2 border">{numberFmt.format(b.bookingPrice ?? 0)}</td>
            <td className="p-2 border">{numberFmt.format(b.labourCost ?? 0)}</td>
            <td className="p-2 border">{numberFmt.format(b.partsCost ?? 0)}</td>
            <td className="p-2 border">{percentFmt(profitPct)}</td>
            <td className="p-2 border">{b.remarks}</td>
            <td className="p-2 border"><StatusBadge status={b.status} /></td>
            <td className="p-2 border text-center">
                <button
                    onClick={() => onCarIn(b)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                >
                    Car In
                </button>
            </td>
        </tr>
    );
}
