import React from "react";
import InlineSpinner from "./InlineSpinner.jsx";

export default function BookingsContent({ loading, error, items, TableComponent, tableProps = {}, emptyMessage }) {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow border border-blue-100 p-4 text-center text-gray-500 inline-flex items-center justify-center gap-2">
                <InlineSpinner /> Loading bookings…
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded">
                {error}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="p-6 bg-yellow-100 text-yellow-800 rounded">
                {emptyMessage || "No bookings found."}
            </div>
        );
    }

    return <TableComponent {...tableProps} />;
}
