import React, { useMemo, useState } from "react";
import { fmtDate, numberFmt, percentFmt } from "../../utils/fmt.js";
import StatusBadge from "./StatusBadge.jsx";
import { updateBookingStatus } from "../../lib/api.js";

export default function BookingRow({ b, i, onUpdate, refreshList }) {
    const [loadingCarIn, setLoadingCarIn] = useState(false);

    const profitPct = useMemo(() => {
        const price = b.bookingPrice ?? 0;
        const labour = b.labourCost ?? 0;
        const parts = b.partsCost ?? 0;
        const cost = labour + parts;
        return cost > 0 ? ((price - cost) / cost) * 100 : 0;
    }, [b]);

    const handleCarIn = async () => {
        setLoadingCarIn(true);
        try {
            await updateBookingStatus(b._id, "arrive");
            if (refreshList) refreshList();
        } catch (err) {
            alert(`Failed to update status: ${err.message}`);
        } finally {
            setLoadingCarIn(false);
        }
    };

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
            <td className="p-2 border">{numberFmt.format(b.bookingPrice)}</td>
            <td className="p-2 border">{numberFmt.format(b.labourCost)}</td>
            <td className="p-2 border">{numberFmt.format(b.partsCost)}</td>
            <td className="p-2 border">{percentFmt(profitPct)}</td>
            <td className="p-2 border">
                {Array.isArray(b.services) && b.services.length > 0
                    ? b.services.map(s => typeof s === "object" ? s.label || s.name : s).join(", ")
                    : b.remarks ?? ""}
            </td>
            <td className="p-2 border"><StatusBadge status={b.status} /></td>
            <td className="p-2 border text-center">
                <button
                    onClick={handleCarIn}
                    disabled={loadingCarIn}
                    className={`bg-green-600 text-white px-3 py-1 rounded ${loadingCarIn ? "opacity-60 cursor-not-allowed" : "hover:bg-green-500"}`}
                >
                    {loadingCarIn ? "..." : "Car In"}
                </button>
            </td>
        </tr>
    );
}
