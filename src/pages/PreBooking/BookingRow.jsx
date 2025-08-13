// app/src/pages/PreBooking/BookingRow.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { fmtDate, numberFmt, percentFmt } from "../../utils/fmt.js";
import StatusBadge from "./StatusBadge.jsx";

function Spinner({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="inline-block align-[-2px]">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" fill="none">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
            </path>
        </svg>
    );
}

function toDateInputValue(iso) {
    if (!iso) return "";
    try {
        return new Date(iso).toISOString().slice(0, 10);
    } catch {
        return "";
    }
}
function fromDateInputValue(yyyyMmDd) {
    return yyyyMmDd ? new Date(yyyyMmDd).toISOString() : "";
}
function diffObj(a, b) {
    const out = {};
    for (const k of Object.keys(b)) {
        if (JSON.stringify(a?.[k]) !== JSON.stringify(b?.[k])) out[k] = b[k];
    }
    return out;
}

export default function BookingRow({ b, i, onCarIn, onUpdate, saving }) {
    const [value, setValue] = useState(b);
    const [editing, setEditing] = useState({});
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        setValue(b);
        setEditing({});
        setDirty(false);
    }, [b?._id]);

    const profitPct = useMemo(() => {
        const price = value.bookingPrice ?? 0;
        const labour = value.labourCost ?? 0;
        const parts = value.partsCost ?? 0;
        const c = labour + parts;
        return c > 0 ? ((price - labour - parts) / c) * 100 : 0;
    }, [value.bookingPrice, value.labourCost, value.partsCost]);

    const beginEdit = useCallback((field) => {
        setEditing((e) => ({ ...e, [field]: true }));
    }, []);
    const endEdit = useCallback((field) => {
        setEditing((e) => {
            const { [field]: _omit, ...rest } = e;
            return rest;
        });
    }, []);
    const handleKey = useCallback(
        (e, field) => {
            if (e.key === "Enter") endEdit(field);
            if (e.key === "Escape") {
                setValue((v) => ({ ...v, [field]: b[field] }));
                endEdit(field);
                const next = { ...value, [field]: b[field] };
                setDirty(Object.keys(diffObj(b, next)).length > 0);
            }
        },
        [b, endEdit, value]
    );

    const editText = (field, placeholder = "") =>
        editing[field] ? (
            <input
                className="w-full p-1 border rounded"
                value={value[field] ?? ""}
                onChange={(e) => {
                    const next = { ...value, [field]: e.target.value };
                    setValue(next);
                    setDirty(Object.keys(diffObj(b, next)).length > 0);
                }}
                onBlur={() => endEdit(field)}
                onKeyDown={(e) => handleKey(e, field)}
                autoFocus
                placeholder={placeholder}
            />
        ) : (
            <span onDoubleClick={() => beginEdit(field)} className="cursor-text select-text">
                {value[field] ?? ""}
            </span>
        );

    const editNumber = (field) =>
        editing[field] ? (
            <input
                type="number"
                className="w-full p-1 border rounded"
                value={value[field] ?? 0}
                min="0"
                step="0.01"
                onChange={(e) => {
                    const n = e.target.value === "" ? 0 : Number(e.target.value);
                    const next = { ...value, [field]: n };
                    setValue(next);
                    setDirty(Object.keys(diffObj(b, next)).length > 0);
                }}
                onBlur={() => endEdit(field)}
                onKeyDown={(e) => handleKey(e, field)}
                autoFocus
            />
        ) : (
            <span onDoubleClick={() => beginEdit(field)} className="cursor-text select-text">
                {numberFmt.format(value[field] ?? 0)}
            </span>
        );

    const editDate = (field) =>
        editing[field] ? (
            <input
                type="date"
                className="w-full p-1 border rounded"
                value={toDateInputValue(value[field])}
                onChange={(e) => {
                    const next = { ...value, [field]: fromDateInputValue(e.target.value) };
                    setValue(next);
                    setDirty(Object.keys(diffObj(b, next)).length > 0);
                }}
                onBlur={() => endEdit(field)}
                onKeyDown={(e) => handleKey(e, field)}
                autoFocus
            />
        ) : (
            <span onDoubleClick={() => beginEdit(field)} className="cursor-text select-text">
                {fmtDate(value[field])}
            </span>
        );

    const handleUpdate = async () => {
        const patch = diffObj(b, value);
        if (!Object.keys(patch).length) return;
        const res = await onUpdate?.(b._id, patch);
        if (res?.ok) {
            setDirty(false);
            setEditing({});
        }
    };

    return (
        <tr className="hover:bg-blue-50 transition">
            <td className="p-2 border">{i + 1}</td>
            {/* Pre-booked date: read-only */}
            <td className="p-2 border">{fmtDate(b.preBookingDate)}</td>

            <td className="p-2 border">{editText("carRegNo", "Reg No.")}</td>
            <td className="p-2 border">{editText("makeModel", "Make & Model")}</td>
            <td className="p-2 border">{editText("clientName", "Client Name")}</td>
            <td className="p-2 border">{editText("phoneNumber", "Phone")}</td>
            <td className="p-2 border">{editText("clientAddress", "Address")}</td>
            <td className="p-2 border">{editDate("scheduledArrivalDate")}</td>

            <td className="p-2 border">{editNumber("bookingPrice")}</td>
            <td className="p-2 border">{editNumber("labourCost")}</td>
            <td className="p-2 border">{editNumber("partsCost")}</td>
            <td className="p-2 border">{percentFmt(profitPct)}</td>

            <td className="p-2 border">{editText("remarks", "Remarks")}</td>

            {/* Status is controlled via dedicated status route; show badge only */}
            <td className="p-2 border">
                <StatusBadge status={value.status} />
            </td>

            <td className="p-2 border text-center">
                {dirty ? (
                    <button
                        onClick={handleUpdate}
                        disabled={saving}
                        aria-busy={saving ? "true" : "false"}
                        className={`bg-red-600 text-white px-3 py-1 rounded ${saving ? "opacity-60 cursor-not-allowed" : "hover:bg-red-500"
                            }`}
                        title={saving ? "Saving…" : "Save changes"}
                    >
                        {saving ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner /> Saving…
                            </span>
                        ) : (
                            "Update"
                        )}
                    </button>
                ) : (
                    <button
                        onClick={() => onCarIn(value)}
                        disabled={saving}
                        className={`bg-green-600 text-white px-3 py-1 rounded ${saving ? "opacity-60 cursor-not-allowed" : "hover:bg-green-500"
                            }`}
                    >
                        Car In
                    </button>
                )}
            </td>
        </tr>
    );
}
