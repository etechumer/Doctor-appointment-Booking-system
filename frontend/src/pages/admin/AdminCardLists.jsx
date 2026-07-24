import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusStyle = {
  BOOKED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-600/20",
};
const useData = (endpoint, key) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/admin${endpoint}`, {
        headers: { "auth-token": localStorage.getItem("token") },
      })
      .then((r) => setData(r.data[key] || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [endpoint, key]);
  return [data, loading];
};
const Shell = ({ title, subtitle, loading, empty, children }) => (
  <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
        Admin portal
      </p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
    {loading ? (
      <p className="text-slate-500">Loading...</p>
    ) : empty ? (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
        No records found.
      </div>
    ) : (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    )}
  </div>
);

export const AdminAppointmentList = ({ title, category, endpoint }) => {
  const [items, loading] = useData(endpoint, "appointments");
  const navigate = useNavigate();
  return (
    <Shell
      title={title}
      subtitle="Select an appointment to view complete information."
      loading={loading}
      empty={!items.length}
    >
      {items.map((a) => {
        const booked = a.status === "BOOKED";
        return (
          <button
            key={a.appointmentId}
            onClick={() =>
              navigate(
                `/admin-page/appointments/${category}/${a.appointmentId}`,
                { state: { appointment: a } },
              )
            }
            className="group flex min-h-68 flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_24px_-18px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_35px_-20px_rgba(37,99,235,0.45)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                {a.patient?.name?.charAt(0)?.toUpperCase() || "P"}
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusStyle[a.status]}`}
              >
                {a.status}
              </span>
            </div>
            <div className="mt-5">
              <p className="text-xs font-medium text-slate-400">PATIENT</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {a.patient?.name || "Patient"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                with {a.doctor?.name || "assigned doctor"}
              </p>
            </div>
            <div className="mt-auto space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <div className="flex gap-2">
                <CalendarDays size={15} className="text-blue-600" />
                {a.date
                  ? new Date(a.date).toLocaleDateString()
                  : "Awaiting decision"}
              </div>
              {booked && (
                <div className="flex gap-2">
                  <Clock3 size={15} className="text-blue-600" />
                  {a.time || "Time to be confirmed"}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-between text-sm font-semibold text-blue-600">
              View details{" "}
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
          </button>
        );
      })}
    </Shell>
  );
};
export const AdminPeopleList = ({ title, type, endpoint, dataKey }) => {
  const [items, loading] = useData(endpoint, dataKey);
  const navigate = useNavigate();
  return (
    <Shell
      title={title}
      subtitle={`Select a ${type.slice(0, -1)} to view their complete profile.`}
      loading={loading}
      empty={!items.length}
    >
      {items.map((p) => (
        <button
          key={p.userId || p.doctorId}
          onClick={() =>
            navigate(`/admin-page/${type}/${p.userId || p.doctorId}`, {
              state: { person: p },
            })
          }
          className="group flex min-h-68 flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_24px_-18px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_35px_-20px_rgba(37,99,235,0.45)]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            {p.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="mt-5">
            <p className="text-xs font-medium text-slate-400">
              {type.slice(0, -1).toUpperCase()}
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">{p.name}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {p.specialization || p.email}
            </p>
          </div>
          <div className="mt-auto space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
            {type === "doctors" ? (
              <>
                <div className="flex gap-2">
                  <GraduationCap size={15} className="text-blue-600" />
                  {p.qualification || "Qualification available"}
                </div>
                <div className="flex gap-2">
                  <BriefcaseBusiness size={15} className="text-blue-600" />
                  {p.experience
                    ? `${p.experience} years experience`
                    : "Experience available"}
                </div>
              </>
            ) : (
              <div>
                {p.gender || "Patient"}
                {p.age ? ` · ${p.age} years` : ""}
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between text-sm font-semibold text-blue-600">
            View profile{" "}
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </button>
      ))}
    </Shell>
  );
};
