// src/pages/Dashboard/index.jsx
import React, { useMemo } from "react";
import useBookings from "../../hooks/useBookings.js";
import BookingsTable from "./bookingsTable.jsx";
import StatCard from "./statCard.jsx";

export default function Dashboard({ user }) {
    const {
        list: bookings,
        loadingList,
        error,
        page,
        setPage,
        totalPages,
        totalItems,
        pageSize,
    } = useBookings({ pageSize: 20 }); // 20 items per page

    // Compute stats
    const stats = useMemo(() => {
        return bookings.reduce(
            (acc, b) => {
                const status = b.status?.toLowerCase() || "unknown";
                switch (status) {
                    case "complete": acc.completed += 1; break;
                    case "pending": acc.pending += 1; break;
                    case "confirmed": acc.confirmed += 1; break;
                    case "arrived": acc.arrived += 1; break;
                    default: acc.other += 1;
                }
                acc.total += 1;
                return acc;
            },
            { total: 0, completed: 0, pending: 0, arrived: 0, other: 0 }
        );
    }, [bookings]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-blue-900">
                Welcome Back{user?.username ? `, ${user.username}` : "!"}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                <StatCard title="Total Bookings" value={stats.total} />
                <StatCard title="Completed" value={stats.completed} />
                <StatCard title="Confirmed" value={stats.confirmed} />
                <StatCard title="Pending" value={stats.pending} />
                <StatCard title="Arrived" value={stats.arrived} />
            </div>

            <BookingsTable bookings={bookings} loading={loadingList} error={error} />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    <button
                        disabled={page <= 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 border rounded">
                        Page {page} of {totalPages} ({totalItems} bookings)
                    </span>
                    <button
                        disabled={page >= totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
