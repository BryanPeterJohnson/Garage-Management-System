// src/pages/CarIn.jsx
import React, { useEffect, useState } from "react";
import { getArrivedBookings, updateBookingStatus } from "../../lib/api.js";

export default function CarIn() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getArrivedBookings();
        setBookings(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        console.error("Error fetching arrived bookings:", err);
        setError("Failed to load arrived bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleCarOut(id) {
    if (!window.confirm("Mark this car as out?")) return;
    try {
      await updateBookingStatus(id, "complete");
      alert("Car marked as out successfully!");
      // Refresh list
      const data = await getArrivedBookings();
      setBookings(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      alert(`Failed: ${err.message}`);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Arrived Cars</h1>

      {bookings.length === 0 ? (
        <div className="bg-yellow-100 p-3 rounded text-yellow-800">
          No arrived bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Pre-Booked</th>
                <th className="px-4 py-2 border">Reg No.</th>
                <th className="px-4 py-2 border">Make & Model</th>
                <th className="px-4 py-2 border">Client</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Arrival (scheduled)</th>
                <th className="px-4 py-2 border">Booking Price</th>
                <th className="px-4 py-2 border">Labour</th>
                <th className="px-4 py-2 border">Parts</th>
                <th className="px-4 py-2 border">Profit</th>
                <th className="px-4 py-2 border">Services</th> {/* ✅ changed */}
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => {
                const profit =
                  (booking.bookingPrice || 0) -
                  (booking.labourCost || 0) -
                  (booking.partsCost || 0);

                return (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">
                      {booking.preBookingDate ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 border">{booking.carRegNo}</td>
                    <td className="px-4 py-2 border">{booking.makeModel}</td>
                    <td className="px-4 py-2 border">{booking.clientName}</td>
                    <td className="px-4 py-2 border">{booking.phoneNumber}</td>
                    <td className="px-4 py-2 border">{booking.clientAddress}</td>
                    <td className="px-4 py-2 border">
                      {new Date(booking.scheduledArrivalDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">{booking.bookingPrice}</td>
                    <td className="px-4 py-2 border">{booking.labourCost}</td>
                    <td className="px-4 py-2 border">{booking.partsCost}</td>
                    <td className="px-4 py-2 border">{profit}</td>
                    <td className="px-4 py-2 border">
                      {Array.isArray(booking.services) && booking.services.length > 0
                        ? booking.services.map(s => s.name).join(", ")
                        : "—"}
                    </td>
                    <td className="px-4 py-2 border">{booking.status}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleCarOut(booking._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Car Out
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
