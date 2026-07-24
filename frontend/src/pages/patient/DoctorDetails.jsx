import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  BriefcaseBusiness,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Detail = ({ icon: Icon, label, value }) => (
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

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loading, setLoading] = useState(!location.state?.doctor);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (doctor) return;
    axios
      .get("http://localhost:4000/api/patient/doctors/getAll", {
        headers: { "auth-token": localStorage.getItem("token") },
      })
      .then((res) =>
        setDoctor(
          (res.data.data || []).find(
            (item) => String(item.doctorId) === doctorId,
          ),
        ),
      )
      .catch((error) => console.error("Error fetching doctor", error))
      .finally(() => setLoading(false));
  }, [doctor, doctorId]);

  const requestAppointment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/patient/request/appointment",
        { doctorId: doctor.doctorId },
        { headers: { "auth-token": localStorage.getItem("token") } },
      );
      setMessage(res.data.message || "Appointment request sent.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to request an appointment.",
      );
    }
  };

  if (loading)
    return (
      <p className="mt-12 text-center text-slate-500">
        Loading doctor profile...
      </p>
    );
  if (!doctor)
    return (
      <div className="p-8 text-center text-slate-500">Doctor not found.</div>
    );
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate("/patient-page")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} /> Back to doctors
      </button>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_-20px_rgba(15,23,42,0.35)]">
        <header className="bg-slate-50/70 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
              {doctor.name?.charAt(0)?.toUpperCase() || "D"}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Doctor profile
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {doctor.name}
              </h2>
              <p className="mt-1 text-slate-500">
                {doctor.specialization || "General medicine"}
              </p>
            </div>
          </div>
        </header>
        <div className="grid gap-7 border-t border-slate-100 p-6 sm:grid-cols-2 sm:p-8">
          <Detail
            icon={GraduationCap}
            label="Qualification"
            value={doctor.qualification}
          />
          <Detail
            icon={BriefcaseBusiness}
            label="Experience"
            value={doctor.experience ? `${doctor.experience} years` : null}
          />
          <Detail icon={Mail} label="Email" value={doctor.email} />
          <Detail icon={Phone} label="Phone" value={doctor.phoneNo} />
        </div>
        <div className="border-t border-slate-100 p-6 sm:px-8">
          {message && (
            <p className="mb-4 text-sm font-medium text-blue-700">{message}</p>
          )}
          <button
            onClick={requestAppointment}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Request appointment
          </button>
        </div>
      </article>
    </div>
  );
};
export default DoctorDetails;
