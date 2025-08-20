// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getAllBookings } from "../lib/api.js";

export default function Dashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const data = await getAllBookings({ page: 1, limit: 100 });
        if (data?.items) {
          setBookings(data.items);
        } else {
          setBookings([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ===== Stats =====
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status?.toLowerCase() === "complete").length;
  const pendingBookings = bookings.filter(b => b.status?.toLowerCase() === "pending").length;
  const confirmedBookings = bookings.filter(b => b.status?.toLowerCase() === "confirmed").length;

  // ===== Recent Bookings (last 5) =====
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Helper to format PKR
  const fmtPKR = (val) =>
    val != null ? `PKR ${Number(val).toLocaleString("en-PK")}` : "";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome Back{user ? `, ${user.username}` : "!"}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Bookings" value={totalBookings} />
        <StatCard title="Completed" value={completedBookings} />
        <StatCard title="Confirmed" value={confirmedBookings} />
        <StatCard title="Pending" value={pendingBookings} />
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <table className="w-full border-collapse text-sm min-w-[1000px]">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Reg No.</th>
                <th className="p-2 border">Make & Model</th>
                <th className="p-2 border">Client Name</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Remarks</th>
                <th className="p-2 border">Booking Price</th>
                <th className="p-2 border">Profit %</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b, idx) => {
                const totalPrice =
                  (Number(b.bookingPrice) || 0) +
                  (Number(b.labourCost) || 0) +
                  (Number(b.partsCost) || 0);
                const profit =
                  b.bookingPrice && totalPrice
                    ? ((Number(b.bookingPrice) -
                        ((Number(b.labourCost) || 0) + (Number(b.partsCost) || 0))) /
                        Number(b.bookingPrice)) *
                      100
                    : 0;

                return (
                  <tr key={b._id || idx} className="hover:bg-gray-50">
                    <td className="p-2 border">{idx + 1}</td>
                    <td className="p-2 border">
                      {b.preBookingDate
                        ? new Date(b.preBookingDate).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="p-2 border">{b.carRegNo}</td>
                    <td className="p-2 border">{b.makeModel}</td>
                    <td className="p-2 border">{b.clientName}</td>
                    <td className="p-2 border">{b.clientAddress}</td>
                    <td className="p-2 border">{b.phoneNumber}</td>
                    <td className="p-2 border">{b.remarks || ""}</td>
                    <td className="p-2 border">{fmtPKR(b.bookingPrice)}</td>
                    <td className="p-2 border">
                      {profit ? `${profit.toFixed(2)}%` : ""}
                    </td>
                    <td className="p-2 border">{b.status}</td>
                  </tr>
                );
              })}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={12} className="p-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h2 className="text-gray-600">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
