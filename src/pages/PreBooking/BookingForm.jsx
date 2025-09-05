import React, { useCallback, useEffect, useMemo, useState } from "react";
import { parseNum, numberFmt, percentFmt } from "../../utils/fmt.js";
import { getServices } from "../../lib/api/servicesApi.js";
import Select from "react-select";

const EMPTY = {
    vehicleRegNo: "",
    makeModel: "",
    ownerName: "",
    ownerAddress: "",
    ownerNumber: "",
    services: [],
    scheduledDate: "",
    prebookingBookingPrice: "",
    prebookingLabourCost: "",
    prebookingPartsCost: "",
};

export default function BookingForm({ loading, onSubmit, onCancel }) {
    const [form, setForm] = useState(EMPTY);
    const [serviceOptions, setServiceOptions] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await getServices();
                setServiceOptions(
                    res.filter(s => s.enabled).map(s => ({ value: s._id, label: s.name }))
                );
            } catch (err) {
                console.error("Failed to fetch services:", err.message);
            }
        })();
    }, []);

    const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }, []);

    const handleServicesChange = (selected) => setForm(f => ({ ...f, services: selected || [] }));

    const { profit, profitPct } = useMemo(() => {
        const price = parseNum(form.prebookingBookingPrice);
        const labour = parseNum(form.prebookingLabourCost);
        const parts = parseNum(form.prebookingPartsCost);
        const cost = labour + parts;
        const pf = price - cost;
        const pct = cost > 0 ? (pf / cost) * 100 : 0;
        return { profit: pf, profitPct: pct };
    }, [form.prebookingBookingPrice, form.prebookingLabourCost, form.prebookingPartsCost]);

    const validate = () => {
        const required = ["vehicleRegNo", "makeModel", "ownerName", "ownerAddress", "ownerNumber"];
        const missing = required.filter(k => !String(form[k]).trim());
        if (missing.length) return `Please fill: ${missing.join(", ")}`;
        if (form.ownerNumber && String(form.ownerNumber).replace(/\D/g, "").length < 7) return "Please enter a valid phone number.";
        return "";
    };

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const problem = validate();
        if (problem) return onSubmit({ error: problem });

        const selectedServices = form.services.map(s => s.value);

        onSubmit({
            payload: {
                vehicleRegNo: form.vehicleRegNo.trim(),
                makeModel: form.makeModel.trim(),
                ownerName: form.ownerName.trim(),
                ownerAddress: form.ownerAddress.trim(),
                ownerNumber: String(form.ownerNumber).trim(),
                prebookingServices: selectedServices,
                remarks: form.services.map(s => s.label).join(", "),
                scheduledDate: form.scheduledDate
                    ? new Date(form.scheduledDate).toISOString()
                    : new Date().toISOString(),
                prebookingBookingPrice: parseNum(form.prebookingBookingPrice),
                prebookingLabourCost: parseNum(form.prebookingLabourCost),
                prebookingPartsCost: parseNum(form.prebookingPartsCost),
            },
            reset: () => setForm(EMPTY),
        });
    }, [form, onSubmit]);

    const handleReset = useCallback(() => setForm(EMPTY), []);

    return (
        <form onSubmit={handleSubmit} className="rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-blue-100 mb-6">
            <input type="date" value={todayISO} readOnly className="border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed" aria-label="Pre-booked on (today)" tabIndex={-1} />
            <input type="text" name="vehicleRegNo" placeholder="Reg No." value={form.vehicleRegNo} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
            <input type="text" name="makeModel" placeholder="Make & Model" value={form.makeModel} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
            <input type="text" name="ownerName" placeholder="Owner Name" value={form.ownerName} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
            <input type="text" name="ownerAddress" placeholder="Owner Address" value={form.ownerAddress} onChange={handleChange} className="border border-gray-300 rounded p-2" required />
            <input type="tel" name="ownerNumber" placeholder="Phone Number" value={form.ownerNumber} onChange={handleChange} className="border border-gray-300 rounded p-2" required />

            <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-700">Select Services</label>
                <Select isMulti options={serviceOptions} value={form.services} onChange={handleServicesChange} placeholder="Choose services..." className="text-sm" />
            </div>

            <input type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} className="border border-gray-300 rounded p-2" aria-label="Scheduled Date" />
            <input type="number" name="prebookingBookingPrice" placeholder="Booking Price" value={form.prebookingBookingPrice} onChange={handleChange} className="border border-gray-300 rounded p-2" min="0" step="0.01" />
            <input type="number" name="prebookingLabourCost" placeholder="Labour Cost" value={form.prebookingLabourCost} onChange={handleChange} className="border border-gray-300 rounded p-2" min="0" step="0.01" />
            <input type="number" name="prebookingPartsCost" placeholder="Parts Cost" value={form.prebookingPartsCost} onChange={handleChange} className="border border-gray-300 rounded p-2" min="0" step="0.01" />

            <input type="text" name="profit" placeholder="Profit" value={numberFmt.format(profit)} readOnly className="border border-gray-300 rounded p-2 bg-gray-100" tabIndex={-1} />
            <input type="text" name="profitPercentage" placeholder="Profit %" value={percentFmt(profitPct)} readOnly className="border border-gray-300 rounded p-2 bg-gray-100" tabIndex={-1} />

            <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold py-2 rounded hover:shadow-lg transition disabled:opacity-60" disabled={loading}>
                    {loading ? "Saving..." : "Save Booking"}
                </button>
                <button type="button" onClick={handleReset} className="px-4 py-2 border rounded hover:bg-gray-50" disabled={loading}>Reset</button>
                {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50" disabled={loading}>Cancel</button>}
            </div>
        </form>
    );
}
