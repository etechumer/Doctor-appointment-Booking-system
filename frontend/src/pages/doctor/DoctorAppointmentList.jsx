import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const styles = {
  BOOKED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const DoctorAppointmentList = ({ title, subtitle, endpoint, category }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/doctor${endpoint}`, {
        headers: { "auth-token": localStorage.getItem("token") },
      })
      .then((res) => setAppointments(res.data.appointments || []))
      .catch((error) =>
        console.error(`Error fetching ${category} appointments`, error),
      )
      .finally(() => setLoading(false));
  }, [endpoint, category]);
  if (loading)
    return (
      <p className="mt-12 text-center text-slate-500">
        Loading appointments...
      </p>
    );
  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Doctor portal
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>
      {!appointments.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          No {category} appointments found.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {appointments.map((appt) => {
            const booked = appt.status === "BOOKED";
            const date = appt.date
              ? new Date(appt.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Awaiting decision";
            return (
              <button
                key={appt.appointmentId}
                type="button"
                onClick={() =>
                  navigate(
                    `/doctor-page/appointments/${category}/${appt.appointmentId}`,
                    { state: { appointment: appt } },
                  )
                }
                className="group flex min-h-68 flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_24px_-18px_rgba(15,23,42,0.4)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_35px_-20px_rgba(37,99,235,0.45)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-base font-bold text-slate-700 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    {appt.patient?.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ring-1 ring-inset ${styles[appt.status] || "bg-slate-100 text-slate-600 ring-slate-200"}`}
                  >
                    {appt.status}
                  </span>
                </div>
                <div className="mt-5">
                  <p className="text-xs font-medium text-slate-400">PATIENT</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {appt.patient?.name || "Patient"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {appt.patient?.gender || "Patient"}
                    {appt.patient?.age ? ` · ${appt.patient.age} years` : ""}
                  </p>
                </div>
                <div className="mt-auto space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={15} className="text-blue-600" />
                    <span>{date}</span>
                  </div>
                  {booked && (
                    <div className="flex items-center gap-2">
                      <Clock3 size={15} className="text-blue-600" />
                      <span>{appt.time || "Time to be confirmed"}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm font-semibold text-blue-600">
                  <span>View details</span>
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default DoctorAppointmentList;
