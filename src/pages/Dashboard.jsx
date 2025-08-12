// src/pages/Dashboard.jsx
import React, { useMemo, useState } from "react";

// Demo data (frontend only). You can replace this array later with real data.
const initialBookings = [
  { id: 1, date: "2025-08-11", reg: "ABC-123", model: "Toyota Corolla", client: "John Doe", addr: "123 Main St", phone: "+92 300 1234567", remarks: "Urgent booking", confirm: "2025-08-12", price: 5000, status: "Confirmed" },
  { id: 2, date: "2025-08-10", reg: "XYZ-987", model: "Honda Civic", client: "Jane Smith", addr: "456 Market Rd", phone: "+92 301 7654321", remarks: "Follow-up needed", confirm: "2025-08-15", price: 6500, status: "Pending" },
  { id: 3, date: "2025-08-09", reg: "LMN-456", model: "Suzuki Alto", client: "Ali Khan", addr: "78 Canal View", phone: "+92 302 9988776", remarks: "Morning delivery", confirm: "2025-08-10", price: 4200, status: "Confirmed" },
  { id: 4, date: "2025-08-08", reg: "DEF-852", model: "Kia Sportage", client: "Sara Ahmed", addr: "99 Garden Town", phone: "+92 303 1239874", remarks: "Evening pickup", confirm: "2025-08-09", price: 9000, status: "Cancelled" },
  { id: 5, date: "2025-08-07", reg: "GHI-741", model: "Hyundai Elantra", client: "Zeeshan Malik", addr: "54 DHA Phase 4", phone: "+92 304 4445566", remarks: "First-time client", confirm: "2025-08-08", price: 7500, status: "Confirmed" },
  { id: 6, date: "2025-08-06", reg: "JKL-963", model: "MG HS", client: "Hina Baloch", addr: "12 Model Town", phone: "+92 305 1122334", remarks: "Requires test drive", confirm: "2025-08-07", price: 8300, status: "Pending" },
  { id: 7, date: "2025-08-05", reg: "MNO-852", model: "Nissan Sunny", client: "Kamran Ali", addr: "34 Johar Town", phone: "+92 306 5544332", remarks: "VIP client", confirm: "2025-08-06", price: 6800, status: "Confirmed" },
  { id: 8, date: "2025-08-04", reg: "PQR-369", model: "Mazda CX-5", client: "Sana Iqbal", addr: "21 Gulberg", phone: "+92 307 9876543", remarks: "Late pickup", confirm: "2025-08-05", price: 7200, status: "Pending" },
  { id: 9, date: "2025-08-03", reg: "STU-147", model: "Ford Ranger", client: "Bilal Khan", addr: "65 Bahria Town", phone: "+92 308 3344556", remarks: "Heavy load", confirm: "2025-08-04", price: 10500, status: "Confirmed" },
  { id: 10, date: "2025-08-02", reg: "VWX-258", model: "Audi A3", client: "Farah Javed", addr: "87 Ferozepur Rd", phone: "+92 309 4455667", remarks: "Special request", confirm: "2025-08-03", price: 15000, status: "Cancelled" },
];

const StatusPill = ({ value }) => {
  const cls =
    value === "Confirmed" ? "text-green-600" :
      value === "Pending" ? "text-yellow-600" :
        "text-red-600";
  return <span className={`font-semibold ${cls}`}>{value}</span>;
};

function HeaderCell({ label, sortKey, activeKey, dir, onSort }) {
  const isActive = sortKey === activeKey;
  return (
    <th
      className="p-2 border cursor-pointer select-none"
      onClick={() => onSort(sortKey)}
      title="Click to sort"
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {isActive && <span>{dir === "asc" ? "▲" : "▼"}</span>}
      </div>
    </th>
  );
}

export default function Dashboard({ user }) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [bookings] = useState(initialBookings);

  const handleSort = (key) => {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    const lcQ = q.trim().toLowerCase();
    return bookings.filter((b) => {
      const t = [b.reg, b.model, b.client, b.addr, b.phone, b.remarks].join(" ").toLowerCase();
      const matchesText = !lcQ || t.includes(lcQ);
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [bookings, q, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const val = (r) =>
        sortKey === "price" ? r.price :
          (sortKey === "date" || sortKey === "confirm") ? new Date(r[sortKey]) :
            (r[sortKey] ?? "");
      const va = val(a), vb = val(b);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalConfirmed = bookings.filter(b => b.status === "Confirmed").length;
  const revenuePKR = bookings.filter(b => b.status === "Confirmed")
    .reduce((s, b) => s + (Number(b.price) || 0), 0);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <h1 className="text-3xl font-bold">
          Welcome Back{user ? `, ${user.username}` : "!"}
        </h1>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          placeholder="Search reg, client, model, address…"
          className="w-full sm:w-80 px-3 py-2 rounded border bg-white"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="w-full sm:w-56 px-3 py-2 rounded border bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {["All", "Confirmed", "Pending", "Cancelled"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Bookings" value={bookings.length} />
        <StatCard title="Confirmed" value={totalConfirmed} />
        <StatCard title="Revenue (PKR)" value={revenuePKR.toLocaleString("en-PK")} />
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Sr No.</th>
              <HeaderCell label="Date" sortKey="date" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <HeaderCell label="Reg No." sortKey="reg" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <HeaderCell label="Make & Model" sortKey="model" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <HeaderCell label="Client Name" sortKey="client" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <HeaderCell label="Address" sortKey="addr" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <HeaderCell label="Phone Number" sortKey="phone" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <HeaderCell label="Remarks" sortKey="remarks" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <HeaderCell label="Confirmed Date" sortKey="confirm" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <HeaderCell label="Booking Price" sortKey="price" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <HeaderCell label="Booking Status" sortKey="status" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((b, idx) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{b.date}</td>
                <td className="p-2 border">{b.reg}</td>
                <td className="p-2 border">{b.model}</td>
                <td className="p-2 border">{b.client}</td>
                <td className="p-2 border">{b.addr}</td>
                <td className="p-2 border">{b.phone}</td>
                <td className="p-2 border">{b.remarks}</td>
                <td className="p-2 border">{b.confirm}</td>
                <td className="p-2 border">PKR {Number(b.price).toLocaleString("en-PK")}</td>
                <td className="p-2 border"><StatusPill value={b.status} /></td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={11} className="p-4 text-center text-gray-500">No results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-gray-600">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
