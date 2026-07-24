import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/patient/doctors/getAll",
          { headers: { "auth-token": localStorage.getItem("token") } },
        );
        setDoctors(res.data.data || []);
      } catch (error) {
        console.error("Error Fetching Doctors", error);
        setMessage("Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Find a specialist
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Book an appointment
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Choose a doctor to view their profile and request an appointment.
        </p>
      </div>
      {loading && <p className="text-slate-500">Loading doctors...</p>}
      {message && (
        <p className="mb-5 text-sm font-medium text-rose-600">{message}</p>
      )}
      {!loading && !doctors.length && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          No doctors available right now.
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <button
            key={doctor.doctorId}
            type="button"
            onClick={() =>
              navigate(`/patient-page/doctors/${doctor.doctorId}`, {
                state: { doctor },
              })
            }
            className="group flex min-h-68 flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_24px_-18px_rgba(15,23,42,0.4)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_35px_-20px_rgba(37,99,235,0.45)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-base font-bold text-slate-700 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                {doctor.name?.charAt(0)?.toUpperCase() || "D"}
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-blue-700 ring-1 ring-inset ring-blue-600/20">
                AVAILABLE
              </span>
            </div>
            <div className="mt-5">
              <p className="text-xs font-medium text-slate-400">
                MEDICAL SPECIALIST
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {doctor.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {doctor.specialization || "General medicine"}
              </p>
            </div>
            <div className="mt-auto space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <GraduationCap size={15} className="text-blue-600" />
                <span>{doctor.qualification || "Qualification available"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={15} className="text-blue-600" />
                <span>
                  {doctor.experience
                    ? `${doctor.experience} years experience`
                    : "Experience available"}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-semibold text-blue-600">
              <span>View profile</span>
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
export default BookAppointments;
