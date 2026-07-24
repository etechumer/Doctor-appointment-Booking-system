import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ title, value, onClick }) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`border rounded p-4 shadow-sm bg-white ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      }`}
    >
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    pendingAppointments: 0,
    bookedAppointments: 0,
    rejectedAppointments: 0,
    totalDoctors: 0,
    totalPatients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      setErr(null);
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:4000/api/admin/dashboard/counts",
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          },
        );
        setCounts(res.data.data);
      } catch (error) {
        console.error("Error fetching dashboard counts", error);
        setErr("Error fetching dashboard counts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <p className="text-gray-800 text-center mt-10">Loading Dashboard...</p>
    );
  if (err) return <p className="text-red-600 text-center mt-10">{err}</p>;

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl! font-bold mb-4 ">Admin Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <Card
            title="Pending Appointments"
            value={counts.pendingAppointments}
            onClick={() => navigate("/admin-page/pending-appointments")}
          />
          <Card
            title="Booked Appointments"
            value={counts.bookedAppointments}
            onClick={() => navigate("/admin-page/booked-appointments")}
          />
          <Card
            title="Rejected Appointments"
            value={counts.rejectedAppointments}
            onClick={() => navigate("/admin-page/rejected-appointments")}
          />

          <Card
            title="Total Doctors"
            value={counts.totalDoctors}
            onClick={() => navigate("/admin-page/doctors-all")}
          />
          <Card
            title="Total Patients"
            value={counts.totalPatients}
            onClick={() => navigate("/admin-page/patients-all")}
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
