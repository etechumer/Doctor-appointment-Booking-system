import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatWindow from "../../components/ChatWindow";

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-medium text-slate-700">
      {value || "Not provided"}
    </p>
  </div>
);

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(
    location.state?.appointment || null,
  );
  const [loading, setLoading] = useState(!location.state?.appointment);
  useEffect(() => {
    if (appointment) return;
    axios
      .get("http://localhost:4000/api/patient/myAppointments", {
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
  }, [appointment, appointmentId]);
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
    : "To be confirmed";
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate("/patient-page/my-appointments")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} /> Back to appointments
      </button>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_-20px_rgba(15,23,42,0.35)]">
        <header className="border-b border-slate-100 bg-slate-50/70 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Appointment #{appointment.appointmentId}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {appointment.doctor?.name || "Assigned doctor"}
              </h2>
              <p className="mt-1 text-slate-500">
                {appointment.doctor?.specialization || "Medical specialist"}
              </p>
            </div>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
              {appointment.status}
            </span>
          </div>
        </header>
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
          <section>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
              Schedule
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
              </div>
            ) : (
              <p className="rounded-xl bg-amber-50 p-5 text-sm leading-6 text-amber-800">
                {appointment.status === "REJECTED"
                  ? "This appointment request was rejected."
                  : "Your request is awaiting doctor confirmation."}
              </p>
            )}
            <div className="mt-5">
              <Info
                label="Notes"
                value={appointment.notes || "No notes provided"}
              />
            </div>
          </section>
          <section>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
              Doctor information
            </h3>
            <div className="grid gap-5">
              <Info
                label="Qualification"
                value={appointment.doctor?.qualification}
              />
              <Info
                label="Experience"
                value={
                  appointment.doctor?.experience
                    ? `${appointment.doctor.experience} years`
                    : null
                }
              />
              <Info
                label="Contact"
                value={appointment.doctor?.phoneNo || appointment.doctor?.email}
              />
            </div>
          </section>
        </div>
        {booked && (
          <div className="border-t border-slate-100 p-6 sm:p-8">
            <ChatWindow
              appointmentId={appointment.appointmentId}
              receiverId={appointment.doctor?.userId}
            />
          </div>
        )}
      </article>
    </div>
  );
};
export default AppointmentDetails;
