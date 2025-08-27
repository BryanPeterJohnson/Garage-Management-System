// src/pages/PreBooking/StatusBadge.jsx
import React from "react";
export default function StatusBadge({ status }) {
    const cls =
        status === "pending" ? "text-yellow-600" :
            status === "arrived" ? "text-blue-600" :
                status === "complete" ? "text-gray-700" : "text-red-600";
    return <span className={`font-semibold capitalize ${cls}`}>{status}</span>;
}
