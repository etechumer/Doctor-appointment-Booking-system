import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, CalendarDays, Mail, Phone } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
const appEndpoints = {
  pending: "/appointments/pending/all",
  booked: "/appointments/booked/all",
  rejected: "/appointments/rejected/all",
};

export const AdminAppointmentDetails = () => {
  const { category, appointmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState(location.state?.appointment || null);
  const [loading, setLoading] = useState(!item);
  useEffect(() => {
    if (item) return;
    axios
      .get(`http://localhost:4000/api/admin${appEndpoints[category]}`, {
        headers: { "auth-token": localStorage.getItem("token") },
      })
      .then((r) =>
        setItem(
          (r.data.appointments || []).find(
            (a) => String(a.appointmentId) === appointmentId,
          ),
        ),
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [item, category, appointmentId]);
  if (loading)
    return (
      <p className="mt-12 text-center text-slate-500">Loading appointment...</p>
    );
  if (!item)
    return (
      <p className="p-8 text-center text-slate-500">Appointment not found.</p>
    );
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={17} /> Back
      </button>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_-20px_rgba(15,23,42,0.35)]">
        <header className="border-b border-slate-100 bg-slate-50/70 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            Appointment #{item.appointmentId}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {item.patient?.name || "Patient"}{" "}
            <span className="font-normal text-slate-400">with</span>{" "}
            {item.doctor?.name || "Doctor"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{item.status}</p>
        </header>
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
          <section>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
              Patient
            </h3>
            <div className="grid gap-4">
              <Info label="Name" value={item.patient?.name} />
              <Info label="Email" value={item.patient?.email} />
              <Info label="Phone" value={item.patient?.phoneNo} />
              <Info
                label="Age / gender"
                value={[item.patient?.age, item.patient?.gender]
                  .filter(Boolean)
                  .join(" · ")}
              />
            </div>
          </section>
          <section>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
              Doctor & schedule
            </h3>
            <div className="grid gap-4">
              <Info label="Doctor" value={item.doctor?.name} />
              <Info
                label="Specialization"
                value={item.doctor?.specialization}
              />
              <Info
                label="Date / time"
                value={
                  item.date
                    ? `${new Date(item.date).toLocaleDateString()} · ${item.time || "Not set"}`
                    : "Not scheduled"
                }
              />
              <Info label="Notes" value={item.notes} />
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export const AdminPersonDetails = () => {
  const { type, personId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [person, setPerson] = useState(location.state?.person || null);
  const [loading, setLoading] = useState(!person);
  useEffect(() => {
    if (person) return;
    const key = type === "doctors" ? "doctors" : "patients";
    axios
      .get(`http://localhost:4000/api/admin/${type}/all`, {
        headers: { "auth-token": localStorage.getItem("token") },
      })
      .then((r) =>
        setPerson(
          (r.data[key] || []).find(
            (p) => String(p.userId || p.doctorId) === personId,
          ),
        ),
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [person, type, personId]);
  if (loading)
    return (
      <p className="mt-12 text-center text-slate-500">Loading profile...</p>
    );
  if (!person)
    return <p className="p-8 text-center text-slate-500">Profile not found.</p>;
  const doctor = type === "doctors";
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={17} /> Back
      </button>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_-20px_rgba(15,23,42,0.35)]">
        <header className="bg-slate-50/70 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
              {person.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                {doctor ? "Doctor" : "Patient"} profile
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {person.name}
              </h2>
              <p className="mt-1 text-slate-500">
                {doctor ? person.specialization : person.role}
              </p>
            </div>
          </div>
        </header>
        <div className="grid gap-6 border-t border-slate-100 p-6 sm:grid-cols-2 sm:p-8">
          <Info label="Email" value={person.email} />
          <Info label="Phone" value={person.phoneNo} />
          <Info
            label="Age / gender"
            value={[person.age, person.gender].filter(Boolean).join(" · ")}
          />
          <Info
            label="Created"
            value={
              person.createdAt
                ? new Date(person.createdAt).toLocaleDateString()
                : null
            }
          />
          {doctor && (
            <>
              <Info label="Qualification" value={person.qualification} />
              <Info
                label="Experience"
                value={person.experience ? `${person.experience} years` : null}
              />
            </>
          )}
        </div>
      </article>
    </div>
  );
};
