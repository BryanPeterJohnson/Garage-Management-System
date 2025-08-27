import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBookings from "../../hooks/useBookings.js";
import CarInTable from "./CarInTable.jsx";
import { updateBookingStatus } from "../../lib/api/bookingApi.js";
import { toast } from "react-toastify";
import BookingsContent from "../../components/BookingsContent.jsx";

export default function CarInPage() {
    const { list: bookings, loadingList, error, setError, refresh } = useBookings({ status: "arrived" });
    const [loadingCarOutId, setLoadingCarOutId] = useState(null);
    const navigate = useNavigate();

    const handleCarOut = useCallback(
        async (booking) => {
            setLoadingCarOutId(booking._id);
            try {
                await updateBookingStatus(booking._id, "complete");
                toast.success("Car checked out successfully!");
                await refresh?.();
                navigate("/dashboard");
            } catch (err) {
                const backendMessage = err.response?.data?.error || err.response?.data?.errors?.[0]?.message || err.message;
                setError(`Failed to update status: ${backendMessage}`);
                toast.error(`Failed to check out car: ${backendMessage}`);
            } finally {
                setLoadingCarOutId(null);
            }
        },
        [navigate, setError, refresh]
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-blue-900">Arrived Cars</h1>
            <BookingsContent
                loading={loadingList}
                error={error}
                items={bookings}
                TableComponent={CarInTable}
                tableProps={{ bookings, onCarOut: handleCarOut, loadingCarOutId }}
                emptyMessage="No arrived bookings found."
            />
        </div>
    );
}
