// src/pages/PreBooking/utils/fmt.js
export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "-");

export const numberFmt = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
});

export const percentFmt = (value) =>
    Number.isFinite(value) ? `${numberFmt.format(value)}%` : "0%";

export const parseNum = (v) => (v === "" || v == null ? 0 : Number(v));
