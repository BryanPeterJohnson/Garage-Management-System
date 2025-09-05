// src/pages/CarIn/BookingDetailModal.jsx
import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { UpsellApi } from "../../lib/api"; // ✅ API

const BookingDetailModal = forwardRef(({ isOpen, onClose, booking, onAddUpsell }, ref) => {
    const [upsells, setUpsells] = useState([]);

    // --- Fetch upsells for booking ---
    const fetchUpsells = useCallback(async () => {
        if (!booking?._id) return;
        try {
            const response = await UpsellApi.getUpsellsByBooking(booking._id);
            const list = Array.isArray(response.upsells) ? response.upsells : [];
            setUpsells(list);
        } catch (err) {
            console.error("Failed to load upsells", err);
            setUpsells([]);
        }
    }, [booking]);

    // Allow parent (CarInPage) to trigger refresh
    useImperativeHandle(ref, () => ({
        refreshUpsells: fetchUpsells,
    }));

    // Fetch on open
    useEffect(() => {
        if (isOpen && booking?._id) {
            fetchUpsells();
        }
    }, [isOpen, booking, fetchUpsells]);

    if (!isOpen || !booking) return null;

    // --- Rows ---
    const rows = [
        {
            type: "Booking (Prebooking)",
            service: booking.prebookingServices?.map((s) => s.name).join(", ") || "-",
            part: "-",
            partPrice: booking.prebookingPartsCost || 0,
            labourPrice: booking.prebookingLabourCost || 0,
            quotedPrice: booking.prebookingBookingPrice || 0,
        },
        ...upsells.map((u) => ({
            type: "Upsell",
            service: u.services?.map((s) => s.name).join(", ") || "-",
            part: u.parts?.map((p) => p.partName).join(", ") || "-",
            partPrice: u.partsCost || 0,
            labourPrice: u.labourCost || 0,
            quotedPrice: u.upsellPrice || 0,
        })),
    ];

    // --- Totals use confirmed booking values + upsells ---
    const totals = {
        type: "Total",
        service: booking.services?.map((s) => s.name).join(", ") || "-",
        part: booking.parts?.map((p) => p.partName).join(", ") || "-",
        partPrice: booking.partsCost || 0,
        labourPrice: booking.labourCost || 0,
        quotedPrice: booking.bookingPrice || 0,
    };
    totals.profit = totals.quotedPrice - (totals.partPrice + totals.labourPrice);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
                {/* Header */}
                <div className="flex justify-between mb-4">
                    <div>
                        <p className="text-sm text-gray-600">
                            <strong>Booking Date:</strong> {booking.createdAt || "-"}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Arrival Date:</strong> {booking.arrivedAt || "-"}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">{booking.makeModel}</p>
                        <p className="text-sm text-gray-600">
                            <strong>Reg:</strong> {booking.vehicleRegNo}
                        </p>
                    </div>
                </div>

                {/* Owner Details */}
                <div className="mb-4 text-sm text-gray-700">
                    <p><strong>Owner:</strong> {booking.ownerName}</p>
                    <p><strong>Address:</strong> {booking.ownerAddress || "-"}</p>
                    <p><strong>Contact:</strong> {booking.ownerNumber}</p>
                </div>

                {/* Booking + Upsells Table */}
                <table className="min-w-full border rounded-lg mb-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-3 border">Type</th>
                            <th className="py-2 px-3 border">Service</th>
                            <th className="py-2 px-3 border">Part</th>
                            <th className="py-2 px-3 border">Part Price</th>
                            <th className="py-2 px-3 border">Labour Price</th>
                            <th className="py-2 px-3 border">Booking Price</th>
                            <th className="py-2 px-3 border">Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-2 px-3 border">{r.type}</td>
                                <td className="py-2 px-3 border">{r.service}</td>
                                <td className="py-2 px-3 border">{r.part}</td>
                                <td className="py-2 px-3 border text-right">£{r.partPrice}</td>
                                <td className="py-2 px-3 border text-right">£{r.labourPrice}</td>
                                <td className="py-2 px-3 border text-right">£{r.quotedPrice}</td>
                                <td className="py-2 px-3 border text-right">
                                    £{r.quotedPrice - (r.partPrice + r.labourPrice)}
                                </td>
                            </tr>
                        ))}
                        {/* Totals Row */}
                        <tr className="bg-gray-100 font-semibold border-t-2">
                            <td className="py-2 px-3 border">{totals.type}</td>
                            <td className="py-2 px-3 border">{totals.service}</td>
                            <td className="py-2 px-3 border">{totals.part}</td>
                            <td className="py-2 px-3 border text-right">£{totals.partPrice}</td>
                            <td className="py-2 px-3 border text-right">£{totals.labourPrice}</td>
                            <td className="py-2 px-3 border text-right">£{totals.quotedPrice}</td>
                            <td className="py-2 px-3 border text-right">£{totals.profit}</td>
                        </tr>
                    </tbody>
                </table>


                {/* Actions */}
                <div className="flex justify-between">
                    <button className="px-4 py-2 border rounded" onClick={onClose}>
                        Close
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={() => onAddUpsell(booking)}
                    >
                        + Add Upsell
                    </button>
                </div>
            </div>
        </div>
    );
});

export default BookingDetailModal;
