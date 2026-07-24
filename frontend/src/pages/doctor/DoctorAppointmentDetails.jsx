import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, CalendarDays, Clock3, Mail, Phone } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatWindow from "../../components/ChatWindow";

const endpointByCategory = {
  pending: "/appointments/pending",
  booked: "/appointments/booked/all",
  rejected: "/appointments/reject/all",
};
const Info = ({ icon: Icon, label, value }) => (
  <div className="flex gap-3">
    <Icon size={18} className="mt-0.5 shrink-0 text-blue-600" />
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-700">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

const DoctorAppointmentDetails = () => {
  const { category, appointmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(
    location.state?.appointment || null,
  );
  const [loading, setLoading] = useState(!location.state?.appointment);
  const [form, setForm] = useState({ date: "", time: "", notes: "" });
  const [message, setMessage] = useState("");
  const backPath =
    category === "pending"
      ? "/doctor-page/appointments-pending"
      : category === "booked"
        ? "/doctor-page/all-appointments-booked"
        : "/doctor-page/all-appointments-rejected";

  useEffect(() => {
    if (appointment) return;
    const endpoint = endpointByCategory[category];
    if (!endpoint) {
      setLoading(false);
      return;
    }
    axios
      .get(`http://localhost:4000/api/doctor${endpoint}`, {
        headers: { "auth-token": localStorage.getItem("token") },
      })
      .then((res) =>
        setAppointment(
          (res.data.appointments || []).find(
            (item) => String(item.appointmentId) === appointmentId,
          ),
        ),
      )
      .catch((error) => console.error("Error fetching appointment", error))
      .finally(() => setLoading(false));
  }, [appointment, appointmentId, category]);

  const updateAppointment = async (action) => {
    if (action === "approve" && (!form.date || !form.time)) {
      setMessage("Please enter a date and time before approving.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:4000/api/doctor/appointments/${action}/${appointment.appointmentId}`,
        form,
        { headers: { "auth-token": localStorage.getItem("token") } },
      );
      navigate(
        action === "approve"
          ? "/doctor-page/all-appointments-booked"
          : "/doctor-page/all-appointments-rejected",
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message || `Unable to ${action} the appointment.`,
      );
    }
  };

  if (loading)
    return (
      <p className="mt-12 text-center text-slate-500">Loading appointment...</p>
    );
  if (!appointment)
    return (
      <div className="p-8 text-center text-slate-500">
        Appointment not found.
      </div>
    );
  const booked = appointment.status === "BOOKED";
  const date = appointment.date
    ? new Date(appointment.date).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate(backPath)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} /> Back to appointments
      </button>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_-20px_rgba(15,23,42,0.35)]">
        <header className="border-b border-slate-100 bg-slate-50/70 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
                {appointment.patient?.name?.charAt(0)?.toUpperCase() || "P"}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Appointment #{appointment.appointmentId}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {appointment.patient?.name || "Patient"}
                </h2>
                <p className="mt-1 text-slate-500">
                  Patient appointment request
                </p>
              </div>
            </div>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
              {appointment.status}
            </span>
          </div>
        </header>
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
          <section>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
              Patient information
            </h3>
            <div className="grid gap-5">
              <Info
                icon={Mail}
                label="Email"
                value={appointment.patient?.email}
              />
              <Info
                icon={Phone}
                label="Phone"
                value={appointment.patient?.phoneNo}
              />
              <Info
                icon={CalendarDays}
                label="Age / gender"
                value={[appointment.patient?.age, appointment.patient?.gender]
                  .filter(Boolean)
                  .join(" · ")}
              />
            </div>
          </section>
          <section>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
              Appointment details
            </h3>
            {booked ? (
              <div className="space-y-4 rounded-xl bg-blue-50 p-5">
                <div className="flex gap-3 text-slate-700">
                  <CalendarDays className="shrink-0 text-blue-600" size={19} />
                  <span>{date}</span>
                </div>
                <div className="flex gap-3 text-slate-700">
                  <Clock3 className="shrink-0 text-blue-600" size={19} />
                  <span>{appointment.time || "Time to be confirmed"}</span>
                </div>
                <p className="border-t border-blue-100 pt-3 text-sm text-slate-600">
                  {appointment.notes || "No notes provided."}
                </p>
              </div>
            ) : (
              <p
                className={`rounded-xl p-5 text-sm leading-6 ${appointment.status === "REJECTED" ? "bg-rose-50 text-rose-800" : "bg-amber-50 text-amber-800"}`}
              >
                {appointment.status === "REJECTED"
                  ? "This appointment request was rejected."
                  : "Set a date and time below to approve this request."}
              </p>
            )}
          </section>
        </div>
        {appointment.status === "PENDING" && (
          <div className="border-t border-slate-100 p-6 sm:p-8">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
              Decision
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
              <input
                placeholder="Time (10:30 AM)"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
              <input
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
            {message && <p className="mt-3 text-sm text-rose-600">{message}</p>}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => updateAppointment("approve")}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Approve appointment
              </button>
              <button
                onClick={() => updateAppointment("reject")}
                className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
              >
                Reject
              </button>
            </div>
          </div>
        )}
        {booked && (
          <div className="border-t border-slate-100 p-6 sm:p-8">
            <ChatWindow
              appointmentId={appointment.appointmentId}
              receiverId={appointment.patient?.userId}
            />
          </div>
        )}
      </article>
    </div>
  );
};
export default DoctorAppointmentDetails;
