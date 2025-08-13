// src/pages/PreBooking/BookingForm.jsx
import React, { useCallback, useMemo, useState } from "react";
import { parseNum, numberFmt, percentFmt } from "../../utils/fmt.js"; // ← adjust path if needed

const EMPTY = {
    // date is UI-only now (not stored)
    regNo: "",
    makeModel: "",
    clientName: "",
    address: "",
    phone: "",
    remarks: "",
    confirmedDate: "",
    price: "",
    labour: "",
    parts: "",
};

export default function BookingForm({ loading, onSubmit, onCancel }) {
    const [form, setForm] = useState(EMPTY);

    // Show today's date in the left-most date field (read-only, UI-only)
    const todayISO = useMemo(
        () => new Date().toISOString().slice(0, 10), // yyyy-mm-dd for <input type="date">
        []
    );

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }, []);

    // Derived profit / %
    const { profit, profitPct } = useMemo(() => {
        const price = parseNum(form.price);
        const labour = parseNum(form.labour);
        const parts = parseNum(form.parts);
        const cost = labour + parts;
        const pf = price - cost;
        const pct = cost > 0 ? (pf / cost) * 100 : 0;
        return { profit: pf, profitPct: pct };
    }, [form.price, form.labour, form.parts]);

    const validate = () => {
        const required = ["regNo", "makeModel", "clientName", "address", "phone"];
        const missing = required.filter((k) => !String(form[k]).trim());
        if (missing.length) return `Please fill: ${missing.join(", ")}`;
        if (form.phone && String(form.phone).replace(/\D/g, "").length < 7) {
            return "Please enter a valid phone number.";
        }
        return "";
    };

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            const problem = validate();
            if (problem) return onSubmit({ error: problem });

            onSubmit({
                payload: {
                    carRegNo: form.regNo.trim(),
                    makeModel: form.makeModel.trim(),
                    clientName: form.clientName.trim(),
                    clientAddress: form.address.trim(),
                    phoneNumber: String(form.phone).trim(),
                    remarks: form.remarks.trim(),
                    scheduledArrivalDate: form.confirmedDate
                        ? new Date(form.confirmedDate).toISOString()
                        : new Date().toISOString(),
                    bookingPrice: parseNum(form.price),
                    labourCost: parseNum(form.labour),
                    partsCost: parseNum(form.parts),
                },
                reset: () => setForm(EMPTY),
            });
        },
        [form, onSubmit]
    );

    const handleReset = useCallback(() => {
        setForm(EMPTY);
    }, []);

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-blue-100 mb-6"
        >
            {/* UI-only pre-booked date: show today, read-only */}
            <input
                type="date"
                value={todayISO}
                readOnly
                className="border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed"
                aria-label="Pre-booked on (today)"
                tabIndex={-1}
            />

            <input
                type="text"
                name="regNo"
                placeholder="Reg No."
                value={form.regNo}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
                required
            />

            <input
                type="text"
                name="makeModel"
                placeholder="Make & Model"
                value={form.makeModel}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
                required
            />

            <input
                type="text"
                name="clientName"
                placeholder="Client Name"
                value={form.clientName}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
                required
            />

            <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
                required
            />

            <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
                required
            />

            {/* Remarks: full-width textarea for longer input */}
            <textarea
                name="remarks"
                placeholder="Remarks"
                value={form.remarks}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 md:col-span-2"
                rows={1}
            />

            {/* Scheduled arrival date (editable) */}
            <input
                type="date"
                name="confirmedDate"
                value={form.confirmedDate}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
                aria-label="Arrival (scheduled)"
            />

            <input
                type="number"
                name="price"
                placeholder="Booking Price"
                value={form.price}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
                min="0"
                step="0.01"
            />

            <input
                type="number"
                name="labour"
                placeholder="Labour Cost"
                value={form.labour}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
                min="0"
                step="0.01"
            />

            <input
                type="number"
                name="parts"
                placeholder="Parts Cost"
                value={form.parts}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2"
                min="0"
                step="0.01"
            />

            {/* Derived (read-only) */}
            <input
                type="text"
                name="profit"
                placeholder="Profit"
                value={numberFmt.format(profit)}
                readOnly
                className="border border-gray-300 rounded p-2 bg-gray-100"
                tabIndex={-1}
                aria-readonly="true"
            />
            <input
                type="text"
                name="profitPercentage"
                placeholder="Profit %"
                value={percentFmt(profitPct)}
                readOnly
                className="border border-gray-300 rounded p-2 bg-gray-100"
                tabIndex={-1}
                aria-readonly="true"
            />

            {/* Status display only */}
            <input
                type="text"
                value="Pending"
                readOnly
                className="border border-gray-300 rounded p-2 bg-gray-100"
                tabIndex={-1}
                aria-readonly="true"
            />

            <div className="md:col-span-2 flex gap-2">
                <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold py-2 rounded hover:shadow-lg transition disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Booking"}
                </button>

                {/* Reset instead of Cancel (top-right Cancel stays) */}
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                    disabled={loading}
                >
                    Reset
                </button>
            </div>
        </form>
    );
}
