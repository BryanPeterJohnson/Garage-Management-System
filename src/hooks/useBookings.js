// src/hooks/useBookings.js
import { useEffect, useMemo, useState, useCallback } from "react";
import { BookingApi } from "../lib/api/bookingApi.js";

export default function useBookings({ status, initialPage = 1, pageSize = 20, sortBy = "createdAt", sortDir = "desc" } = {}) {
    const [items, setItems] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // --- Fetch bookings ---
    const fetchBookings = useCallback(async () => {
        setLoadingList(true);
        setError("");
        try {
            const res = await BookingApi.getBookings({ status, page, limit: pageSize, sortBy, sortDir });
            if (res.ok) {
                // normalize _id for all bookings
                const normalizedItems = res.items.map(b => ({ ...b, _id: b._id || b.id }));
                setItems(normalizedItems);
                setTotalPages(res.totalPages);
                setTotalItems(res.totalItems);
            } else {
                setError(res.error || "Failed to fetch bookings");
            }
        } catch (err) {
            setError(err.message || "Failed to fetch bookings");
        } finally {
            setLoadingList(false);
        }
    }, [status, page, pageSize, sortBy, sortDir]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // --- Create booking ---
    const create = async (payload) => {
        setError("");
        setSaving(true);
        try {
            const res = await BookingApi.createBooking(payload);
            if (res.ok) {
                const newBooking = { ...res.booking, _id: res.booking._id || res.booking.id };
                setItems(prev => [newBooking, ...prev]);
                return { ok: true, booking: newBooking };
            } else {
                setError(res.error);
                return { ok: false, error: res.error };
            }
        } catch (err) {
            const msg = err.message || "Failed to create booking";
            setError(msg);
            return { ok: false, error: msg };
        } finally {
            setSaving(false);
        }
    };

    // --- Update booking ---
    const update = async (id, patch) => {
        setError("");
        setSaving(true);
        try {
            const res = await BookingApi.updateBooking(id, patch);
            if (res.ok) {
                const updatedBooking = { ...res.booking, _id: res.booking._id || res.booking.id };
                setItems(prev => prev.map(b => b._id === id ? updatedBooking : b));
                return { ok: true, booking: updatedBooking };
            } else {
                setError(res.error);
                return { ok: false, error: res.error };
            }
        } catch (err) {
            const msg = err.message || "Failed to update booking";
            setError(msg);
            return { ok: false, error: msg };
        } finally {
            setSaving(false);
        }
    };

    // --- Update booking status ---
    const updateStatus = async (id, status) => {
        setError("");
        setSaving(true);
        try {
            if (!id || !status) throw new Error("Booking ID and status are required");

            const res = await BookingApi.updateBookingStatus(id, status);
            if (res.ok) {
                const updatedBooking = { ...res.booking, _id: res.booking._id || res.booking.id };

                // Remove from list if status no longer matches filter
                if (status !== status) { // redundant check, can skip
                    setItems(prev => prev.filter(b => b._id !== id));
                } else {
                    setItems(prev => prev.map(b => b._id === id ? updatedBooking : b));
                }

                return { ok: true, booking: updatedBooking };
            } else {
                setError(res.error);
                return { ok: false, error: res.error };
            }
        } catch (err) {
            const msg = err.message || "Failed to update booking status";
            setError(msg);
            return { ok: false, error: msg };
        } finally {
            setSaving(false);
        }
    };

    // --- Refresh list ---
    const refresh = () => fetchBookings();

    return {
        items,
        list: useMemo(() => items, [items]),
        loadingList,
        saving,
        error,
        setError,
        page,
        setPage,
        totalPages,
        totalItems,
        pageSize,
        fetchBookings,
        refresh,
        create,
        update,
        updateStatus,
    };
}
