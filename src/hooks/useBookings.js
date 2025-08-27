// app/src/pages/hooks/useBookings.js
import { useEffect, useMemo, useState } from "react";
import { BookingApi } from "../lib/api"; // import namespace

export default function useBookings({ status } = {}) {
    const [items, setItems] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const { getBookings, createBooking, updateBooking } = BookingApi;

    // Fetch list with optional status filter
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoadingList(true);
                const { items: list = [] } = await getBookings(status ? { status } : {});
                if (cancelled) return;

                const sorted = [...list].sort(
                    (a, b) =>
                        new Date(b?.preBookingDate || b?._id) -
                        new Date(a?.preBookingDate || a?._id)
                );

                setItems(sorted);
            } catch (err) {
                if (!cancelled) setError(err?.message || "Failed to load bookings");
            } finally {
                if (!cancelled) setLoadingList(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [getBookings, status]);

    // Create
    const create = async (payload) => {
        setError("");
        try {
            setSaving(true);
            const { booking } = await createBooking(payload);
            setItems((prev) => [booking, ...prev]);
            return { ok: true, booking };
        } catch (err) {
            const msg = err?.message || "Failed to save booking";
            setError(msg);
            return { ok: false, error: msg };
        } finally {
            setSaving(false);
        }
    };

    // Update
    const update = async (id, patch) => {
        setError("");
        try {
            setSaving(true);
            const { booking } = await updateBooking(id, patch);
            setItems((prev) => prev.map((it) => (it._id === id ? booking : it)));
            return { ok: true, booking };
        } catch (err) {
            const msg = err?.message || "Failed to update booking";
            setError(msg);
            return { ok: false, error: msg };
        } finally {
            setSaving(false);
        }
    };

    return {
        items,
        loadingList,
        saving,
        error,
        setError,
        create,
        update,
        list: useMemo(() => items, [items]),
    };
}
