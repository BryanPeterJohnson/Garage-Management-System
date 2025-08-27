import React, { useMemo } from "react";
import useBookings from "../../hooks/useBookings.js";
import RecentBookingsTable from "./RecentBookingsTable.jsx";
import StatCard from "./StatCard.jsx";

export default function Dashboard({ user }) {
    const { list: bookings, loadingList, error } = useBookings({});

    // Single-pass stats computation
    const stats = useMemo(() => {
        return bookings.reduce((acc, b) => {
            const status = b.status?.toLowerCase();
            if (status === "complete") acc.completed += 1;
            else if (status === "pending") acc.pending += 1;
            else if (status === "confirmed") acc.confirmed += 1;
            acc.total += 1;
            return acc;
        }, { total: 0, completed: 0, pending: 0, confirmed: 0 });
    }, [bookings]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Welcome Back{user ? `, ${user.username}` : "!"}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Bookings" value={stats.total} />
                <StatCard title="Completed" value={stats.completed} />
                <StatCard title="Confirmed" value={stats.confirmed} />
                <StatCard title="Pending" value={stats.pending} />
            </div>

            <RecentBookingsTable bookings={bookings} loading={loadingList} error={error} />
        </div>
    );
}
