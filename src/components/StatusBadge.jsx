// src/pages/PreBooking/StatusBadge.jsx
import React from "react";

const STATUS_STYLES = {
    pending: "bg-yellow-100 text-yellow-800",
    arrived: "bg-blue-100 text-blue-800",
    complete: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }) {
    const cls = STATUS_STYLES[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
    return (
        <span className={`inline-block px-2 py-1 rounded text-sm font-semibold capitalize ${cls}`}>
            {status || "unknown"}
        </span>
    );
}
